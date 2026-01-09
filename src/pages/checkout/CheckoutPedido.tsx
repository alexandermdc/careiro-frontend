import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import pedidoService from '../../services/pedidoService';
import pagamentoService from '../../services/pagamentoService';
import { ModalNotificacao } from '../../components/ModalNotificacao';
import { useNotificacao } from '../../hooks/useNotificacao';

export default function CheckoutPedido() {
  const navigate = useNavigate();
  const { itens, valorTotal, limparCarrinho } = useCarrinho();
  const notificacao = useNotificacao();
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleFinalizarPedido = async () => {
    // Validações
    if (itens.length === 0) {
      notificacao.aviso('Seu carrinho está vazio!');
      navigate('/produtos');
      return;
    }

    // Verificar autenticação
    const token = localStorage.getItem('accessToken');
    if (!token) {
      notificacao.aviso('Você precisa estar logado para finalizar a compra!');
      navigate('/login');
      return;
    }

    // Verificar se tem vendedor (obrigatório)
    const itemSemVendedor = itens.find(item => !item.id_vendedor);
    if (itemSemVendedor) {
      setErro(`O produto "${itemSemVendedor.nome}" não possui vendedor associado.`);
      return;
    }

    // Usar primeira feira encontrada ou null se não houver
    // Verificar se fk_feira é um número válido
    const primeiraFeira = itens.find(item => item.fk_feira)?.fk_feira;
    const fk_feira = primeiraFeira && !isNaN(Number(primeiraFeira)) 
      ? Number(primeiraFeira) 
      : null;

    setProcessando(true);
    setErro(null);

    try {
      
      // Preparar dados do pedido
      const produtos = itens.map(item => ({
        produto_id: String(item.id),
        quantidade: item.quantidade,
        id_vendedor: item.id_vendedor!
      }));

      const dadosPedido = {
        data_pedido: new Date().toISOString(),
        fk_feira: fk_feira,
        produtos: produtos
      };


      // 1. Criar pedido no backend
      const pedidoCriado = await pedidoService.criarPedido(dadosPedido);


      // 2. Criar preferência de pagamento no Mercado Pago
      
      const { initPoint } = await pagamentoService.criarPreferencia(pedidoCriado.pedido_id);


      // 3. Salvar pedido_id para quando retornar do pagamento
      localStorage.setItem('ultimo_pedido_id', pedidoCriado.pedido_id.toString());

      // 4. Limpar carrinho
      limparCarrinho();

      // 5. Redirecionar para Mercado Pago
      window.location.href = initPoint;

    } catch (error: any) {
      
      if (error.response) {
        setErro(error.response.data.error || 'Erro ao criar pedido');
      } else {
        setErro('Erro de conexão com o servidor');
      }
    } finally {
      setProcessando(false);
    }
  };

  if (itens.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Carrinho Vazio</h2>
          <p className="text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar o pedido.</p>
          <button
            onClick={() => navigate('/produtos')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Ver Produtos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Finalizar Pedido</h1>

          {/* Erro */}
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">Erro</p>
              <p>{erro}</p>
            </div>
          )}

          {/* Resumo do Pedido */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo do Pedido</h2>
            
            {itens.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.nome}</p>
                  <p className="text-sm text-gray-600">
                    Quantidade: {item.quantidade} x R$ {item.preco.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Feira: {item.vendedor}</p>
                </div>
                <p className="font-bold text-green-600">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="flex justify-between items-center py-4 border-t-2 border-gray-300 mt-4">
              <p className="text-xl font-bold text-gray-800">Total</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {valorTotal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Informações Importantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Fluxo de Pagamento:</strong> Ao confirmar, seu pedido será criado no sistema 
              e você será redirecionado para o Mercado Pago para realizar o pagamento.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/carrinho')}
              disabled={processando}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold disabled:opacity-50"
            >
              Voltar ao Carrinho
            </button>
            
            <button
              onClick={handleFinalizarPedido}
              disabled={processando}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processando...
                </>
              ) : (
                '💳 Confirmar e Pagar'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Notificação */}
      <ModalNotificacao
        isOpen={notificacao.isOpen}
        onClose={notificacao.fechar}
        {...notificacao.config}
      />
    </div>
  );
}
