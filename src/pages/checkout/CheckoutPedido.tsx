import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import pedidoService from '../../services/pedidoService';
import pagamentoService from '../../services/pagamentoService';
import associacaoService from '../../services/associacaoService';
import type { Associacao } from '../../services/associacaoService';
import { ModalNotificacao } from '../../components/ModalNotificacao';
import { useNotificacao } from '../../hooks/useNotificacao';

export default function CheckoutPedido() {
  const navigate = useNavigate();
  const { itens, valorTotal, limparCarrinho } = useCarrinho();
  const notificacao = useNotificacao();
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [formaEntrega, setFormaEntrega] = useState<'retirada' | 'entrega'>('retirada');
  const [fkAssociacaoRetirada, setFkAssociacaoRetirada] = useState('');

  const associacaoSelecionada = associacoes.find((assoc) => assoc.id_associacao === fkAssociacaoRetirada) || null;

  useEffect(() => {
    const carregarAssociacoes = async () => {
      try {
        const data = await associacaoService.getDisponiveisRetirada();
        setAssociacoes(data || []);
      } catch (error) {
        console.error('❌ Erro ao carregar associações:', error);
        setAssociacoes([]);
      }
    };

    carregarAssociacoes();
  }, []);

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

    if (!fkAssociacaoRetirada) {
      setErro('Selecione o local de retirada antes de continuar.');
      return;
    }

    if (!associacaoSelecionada) {
      setErro('O local de retirada selecionado não está disponível. Escolha outro.');
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
        fk_associacao_retirada: fkAssociacaoRetirada,
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

          {/* Parte de cima / fluxo */}
          <div className="mb-6 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-verde-escuro">Checkout</p>
                <h2 className="text-2xl font-bold text-gray-900">Revise sua compra e escolha a retirada</h2>
                <p className="mt-1 text-sm text-gray-600">
                  O sistema mostra apenas as associações liberadas pelo administrador.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-verde-escuro px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  1. Carrinho
                </span>
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-verde-escuro">
                  2. Retirada
                </span>
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                  3. Pagamento
                </span>
              </div>
            </div>

            {formaEntrega === 'retirada' && (
              <div className="mt-5 rounded-2xl border border-green-200 bg-white p-4">
                <p className="text-sm font-semibold text-gray-700">Local de retirada selecionado</p>
                {associacaoSelecionada ? (
                  <div className="mt-2">
                    <p className="text-lg font-bold text-verde-escuro">{associacaoSelecionada.nome}</p>
                    <p className="text-sm text-gray-600">
                      {associacaoSelecionada.endereco || associacaoSelecionada.descricao || 'Local de retirada'}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-amber-700">
                    Selecione uma associação abaixo para continuar.
                  </p>
                )}
              </div>
            )}
          </div>

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

          {/* Forma de Entrega */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Forma de Entrega</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'retirada', label: 'Retirada' },
                { key: 'entrega', label: 'Entrega' },
              ].map((opcao) => {
                const selecionado = formaEntrega === opcao.key;
                return (
                  <button
                    key={opcao.key}
                    type="button"
                    onClick={() => setFormaEntrega(opcao.key as 'retirada' | 'entrega')}
                    className={`px-5 py-3 rounded-full border-2 font-semibold transition-all ${
                      selecionado
                        ? 'bg-verde-escuro border-verde-escuro text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-verde-escuro hover:text-verde-escuro'
                    }`}
                  >
                    {opcao.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local de Retirada */}
          {formaEntrega === 'retirada' && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Local de Retirada</h2>
              <p className="text-sm text-gray-600 mb-4">
                Escolha uma associação disponível para retirar seu pedido.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {associacoes.map((assoc) => {
                  const selecionado = fkAssociacaoRetirada === assoc.id_associacao;
                  return (
                    <button
                      key={assoc.id_associacao}
                      type="button"
                      onClick={() => setFkAssociacaoRetirada(assoc.id_associacao)}
                      className={`text-left rounded-2xl border-2 px-4 py-4 transition-all ${
                        selecionado
                          ? 'bg-green-50 border-verde-escuro shadow-md'
                          : 'bg-white border-gray-200 hover:border-verde-escuro/60 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-3 h-3 rounded-full ${selecionado ? 'bg-verde-escuro' : 'bg-gray-300'}`} />
                        <div className="min-w-0">
                          <p className={`font-semibold truncate ${selecionado ? 'text-verde-escuro' : 'text-gray-800'}`}>
                            {assoc.nome}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {assoc.endereco || assoc.descricao || 'Local de retirada'}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {associacoes.length === 0 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                    Nenhuma associação foi liberada pelo administrador para retirada no momento.
                </div>
              )}
            </div>
          )}

          {/* Local de Entrega / Data e Horário */}
          {formaEntrega === 'entrega' && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Local de Entrega</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  className="px-5 py-3 rounded-full border-2 font-semibold bg-verde-escuro border-verde-escuro text-white shadow-md text-left"
                >
                  Feira Central
                </button>
                <button
                  type="button"
                  className="px-5 py-3 rounded-full border-2 font-semibold bg-white border-gray-200 text-gray-700 hover:border-verde-escuro hover:text-verde-escuro text-left"
                >
                  Feira Itinerante
                </button>
                <button
                  type="button"
                  className="px-5 py-3 rounded-full border-2 font-semibold bg-white border-gray-200 text-gray-700 hover:border-verde-escuro hover:text-verde-escuro text-left"
                >
                  Sede da Associação
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Data e Horário</h3>
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="px-5 py-3 rounded-full border-2 font-semibold bg-white border-gray-200 text-gray-700 hover:border-verde-escuro hover:text-verde-escuro">
                    Hoje
                  </button>
                  <button type="button" className="px-5 py-3 rounded-full border-2 font-semibold bg-white border-gray-200 text-gray-700 hover:border-verde-escuro hover:text-verde-escuro">
                    Amanhã
                  </button>
                  <button type="button" className="px-5 py-3 rounded-full border-2 font-semibold bg-white border-gray-200 text-gray-700 hover:border-verde-escuro hover:text-verde-escuro">
                    14:00 - 16:00
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Informações Importantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Fluxo de Pagamento:</strong> Ao confirmar, seu pedido será criado no sistema
              com o local de retirada selecionado e você será redirecionado para o Mercado Pago para realizar o pagamento.
            </p>
          </div>

          <div className="h-24" />
        </div>
      </div>

      {/* Rodapé fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F0F3F0] border-t border-gray-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] z-50">
        <div className="container mx-auto max-w-2xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-gray-600">Total a pagar</p>
            <p className="text-2xl font-bold text-verde-escuro">R$ {valorTotal.toFixed(2)}</p>
            {formaEntrega === 'retirada' && associacaoSelecionada && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                Retirada: {associacaoSelecionada.nome}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/carrinho')}
              disabled={processando}
              className="px-5 py-3 rounded-2xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Voltar
            </button>

            <button
              onClick={handleFinalizarPedido}
              disabled={processando || (formaEntrega === 'retirada' && !fkAssociacaoRetirada)}
              className="px-6 py-3 rounded-2xl bg-verde-escuro text-white font-bold hover:bg-verde-escuro/90 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {processando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processando...
                </>
              ) : (
                'Finalizar Pedido'
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
