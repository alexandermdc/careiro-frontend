import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import pedidoService from '../../services/pedidoService';
import pagamentoService from '../../services/pagamentoService';

export default function CarrinhoPage() {
  const { itens, removerDoCarrinho, atualizarQuantidade, valorTotal } = useCarrinho();
  const navigate = useNavigate();
  const [processando, setProcessando] = useState(false);



  const handleFinalizarCompra = async () => {
    if (itens.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    // Verificar autenticação - USAR accessToken (não token)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('⚠️ Você precisa estar logado para finalizar a compra!\n\nRedirecionando para login...');
      navigate('/login');
      return;
    }

    setProcessando(true);

    try {
      // 1. Criar pedido no banco de dados

      
      const pedido = await pedidoService.criarPedido({
        data_pedido: new Date().toISOString(),
        fk_feira: null, // Pode ser null se não for vinculado a feira específica
        produtos: itens.map(item => ({
          produto_id: String(item.id),
          quantidade: item.quantidade,
          id_vendedor: item.id_vendedor || '', // Pegar do item se disponível
        }))
      });



      // 2. Criar preferência de pagamento no Mercado Pago

      
      const { initPoint } = await pagamentoService.criarPreferencia(pedido.pedido_id);

      // 3. Redirecionar para o Mercado Pago

      pagamentoService.redirecionarParaCheckout(initPoint);

    } catch (error: any) {
      console.error('❌ Erro ao processar compra:', error);

      // Tratamento de erro de sessão expirada
      if (error.message.includes('Sessão expirada') || error.message.includes('401')) {
        alert('⚠️ Sessão expirada! Faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        alert(`Erro ao processar compra:\n${error.message}`);
      }
    } finally {
      setProcessando(false);
    }
  };

  if (itens.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-[#F0F3F0] text-gray-800 shadow-md w-full h-[135px] flex items-center">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/produtos')}
                className="p-2 hover:bg-gray-200 rounded-full transition"
                title="Voltar para produtos"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <img src="/img/logoagriconect.svg" alt="Logo Agriconnect" className="h-20" />
            </div>
            <div className="flex-1"></div> {/* Espaçador flexível */}
            <h1 className="text-[24px] font-bold text-[#1A3C11] text-center [font-family:'Montserrat',Helvetica] leading-normal mr-8">Sua sacola</h1>
          </div>
        </header>

        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Carrinho Vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos para começar suas compras</p>
            <button
            onClick={() => navigate('/produtos')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Ver Produtos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#F0F3F0] text-gray-800 shadow-md w-full h-[135px] flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/produtos')}
              className="p-2 hover:bg-gray-200 rounded-full transition"
              title="Voltar para produtos"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <img src="/img/logoagriconect.svg" alt="Logo Agriconnect" className="h-20" />
          </div>
          <div className="flex-1"></div> {/* Espaçador flexível */}
          <h1 className="text-[24px] font-bold text-[#1A3C11] text-center [font-family:'Montserrat',Helvetica] leading-normal mr-8">Sua sacola</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto px-6 py-8 mb-40 max-w-[1110px]">
        {/* Título: Resumo da compra */}
        <h2 className="text-[#1D4510] font-montserrat text-2xl font-bold leading-[30px] mb-6">
          Resumo da compra
        </h2>

        {/* Cabeçalho da tabela */}
        <div className="flex w-full h-20 px-11 py-6 items-center shrink-0 rounded-2xl border border-[#D5D7D4] bg-[#F0F3F0] mb-4">
          <div className="grid grid-cols-12 gap-4 w-full items-center font-bold text-gray-700 text-sm">
            <div className="col-span-6">Produto</div>
            <div className="col-span-2 text-center">Preço</div>
            <div className="col-span-2 text-center">Quantidade</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
        </div>

        {/* Lista de produtos - cada um com sua própria borda */}
        <div className="space-y-4">
          {itens.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-[#D5D7D4] hover:shadow-md transition min-h-[112px] px-[33px] py-6 flex items-center"
            >
                <div className="grid grid-cols-12 gap-4 items-center w-full">
                  {/* Produto (imagem + nome) */}
                  <div className="col-span-6 flex items-center gap-4">
                    {item.imagem && (item.imagem.startsWith('data:image') || item.imagem.startsWith('http')) ? (
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.placeholder-mini')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'placeholder-mini w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center';
                            placeholder.innerHTML = '<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                            parent.insertBefore(placeholder, target);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">
                        {item.nome}
                      </h3>
                      {item.vendedor && (
                        <p className="text-sm text-gray-500 mt-1">
                          Vendedor: {item.vendedor}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="col-span-2 text-center">
                    <span className="text-gray-800 font-medium">
                      R${item.preco.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantidade */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center gap-3 border border-[#9CB217] bg-[#FBFCFA] rounded-[16px] px-4 py-2">
                      <button
                        onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-[#9CB217]/10 rounded-full transition text-[#9CB217]"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <span className="font-semibold text-[#1A3C11] w-8 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-[#9CB217]/10 rounded-full transition text-[#9CB217]"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 text-right">
                    <span className="text-gray-800 font-bold text-lg">
                      R${(item.preco * item.quantidade).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removerDoCarrinho(item.id)}
                      className="block text-red-500 hover:text-red-700 text-xs mt-2 ml-auto"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Total a Pagar - Fixo no fundo */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F0F3F0] shadow-lg border-t border-gray-300 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center max-w-5xl">
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm mb-1">Total a pagar</span>
            <span className="text-[#1A3C11] text-3xl font-bold [font-family:'Montserrat',Helvetica]">
              R$ {valorTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleFinalizarCompra}
            className="bg-[#1D4510] hover:bg-[#163809] text-white px-10 py-4 rounded-2xl font-bold text-lg transition flex items-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={processando}
          >
            {processando ? 'Processando...' : 'Finalizar Compra'}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
