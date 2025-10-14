import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import api from '../../services/api';
import pagamentoService from '../../services/pagamentoService';
import type { PedidoComProdutos } from '../../types/pagamento';

export default function CheckoutReal() {
  const navigate = useNavigate();
  const { itens: carrinho, valorTotal } = useCarrinho();
  const [loading, setLoading] = useState(false);
  const [feiraId] = useState<number>(1); // ID da feira (ajustar conforme necessário)

  const handleFinalizarCompra = async () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('⚠️ Você precisa estar logado para finalizar a compra!\n\nRedirecionando para login...');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // 1. Criar o pedido com os produtos
      console.log('📦 Criando pedido...');
      // Converter produtos do carrinho mockado para formato do backend
      // Nota: Como são produtos mockados, vamos usar ID fake ou criar um mapeamento
      const pedidoResponse = await api.post<PedidoComProdutos>('/pedido', {
        fk_feira: feiraId,
        itens: carrinho.map(item => ({
          produto_id: item.id, // ID mockado do produto
          quantidade: item.quantidade
        }))
      });

      const pedidoCriado = pedidoResponse.data;
      console.log('✅ Pedido criado:', pedidoCriado);

      // 2. Criar preferência de pagamento no Mercado Pago
      const { initPoint } = await pagamentoService.criarPreferencia(pedidoCriado.pedido_id);

      if (!initPoint) {
        throw new Error('URL de pagamento não foi gerada');
      }

      // 3. Salvar pedido_id no localStorage
      localStorage.setItem('ultimo_pedido_id', pedidoCriado.pedido_id.toString());

      // 4. Redirecionar para o Mercado Pago
      pagamentoService.redirecionarParaCheckout(initPoint);

    } catch (error: any) {
      console.error('❌ Erro ao finalizar compra:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert('⚠️ Sessão expirada! Faça login novamente.');
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          alert(`Erro ao processar pagamento:\n${error.response.data?.error || error.message}`);
        }
      } else {
        alert(`Erro ao processar pagamento:\n${error.message}`);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🛒 Checkout</h1>
          <button
            onClick={() => navigate('/carrinho')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold"
          >
            ← Voltar ao Carrinho
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto p-6">
        {carrinho.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Carrinho Vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos para finalizar a compra</p>
            <button
              onClick={() => navigate('/produtos-teste')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Ver Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Itens do Pedido ({carrinho.length})
              </h2>

              {carrinho.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 flex gap-4"
                >
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Vendedor: {item.vendedor}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Quantidade: {item.quantidade}
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'})</span>
                    <span className="font-semibold">R$ {valorTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className="font-semibold text-green-600">Grátis</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600">R$ {valorTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinalizarCompra}
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-bold text-white transition ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? '⏳ Processando...' : '💳 Pagar com Mercado Pago'}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Ao finalizar, você será redirecionado para o Mercado Pago
                </p>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Ambiente de Teste</strong><br />
                    Use os cartões de teste do Mercado Pago
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
