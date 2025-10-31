import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function CarrinhoPage() {
  const { itens, removerDoCarrinho, atualizarQuantidade, limparCarrinho, valorTotal, totalItens } = useCarrinho();
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
      // Gerar ID único para o pedido
      const testeId = `pedido-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Preparar itens no formato esperado pelo backend
      const itensParaBackend = itens.map(item => ({
        id_produto: item.id,
        quantidade: item.quantidade
      }));
      
      console.log('📦 Dados do carrinho:', {
        testeId,
        totalItens,
        valorTotal,
        itens: itensParaBackend
      });

      // Chamar a API do backend com TODOS os dados necessários
      const response = await axios.post(
        'http://localhost:3000/mercadopago/pagamento',
        { 
          testeId,
          itens: itensParaBackend,
          valorTotal
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('✅ Resposta do backend:', response.data);

      // Redirecionar para o Mercado Pago
      if (response.data.initPoint) {
        console.log('🔄 Redirecionando para Mercado Pago...');
        window.location.href = response.data.initPoint;
      } else if (response.data.init_point) {
        console.log('🔄 Redirecionando para Mercado Pago...');
        window.location.href = response.data.init_point;
      } else {
        console.error('❌ Resposta sem init_point:', response.data);
        alert('Erro: Link de pagamento não foi gerado pelo backend');
      }

    } catch (error: any) {
      console.error('❌ Erro ao processar pagamento:', error);
      
      if (error.response) {
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data
        });
        
        if (error.response.status === 401) {
          alert('⚠️ Sessão expirada! Faça login novamente.');
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          alert(`Erro ao processar pagamento:\n${error.response.data?.error || error.message}`);
        }
      } else {
        alert(`Erro de conexão:\n${error.message}\n\nVerifique se o backend está rodando em http://localhost:3000`);
      }
    } finally {
      setProcessando(false);
    }
  };

  if (itens.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-600 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">🛒 Meu Carrinho</h1>
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
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🛒 Meu Carrinho</h1>
          <button
            onClick={() => navigate('/produtos')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold"
          >
            ← Continuar Comprando
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Produtos ({totalItens} {totalItens === 1 ? 'item' : 'itens'})
              </h2>
              <button
                onClick={limparCarrinho}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Limpar Carrinho
              </button>
            </div>

            {itens.map((item) => (
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
                  <p className="text-xl font-bold text-green-600">
                    R$ {item.preco.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={() => removerDoCarrinho(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    Remover
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Resumo do Pedido
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})</span>
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
                className="w-full mt-3 py-4 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition"
                disabled={processando}
              >
                 {processando ? 'Processando...' : 'Criar Pedido e Pagar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
