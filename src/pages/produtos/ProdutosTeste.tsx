import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';

interface ProdutoAPI {
  id_produto: string;
  nome: string;
  descricao: string;
  preco: number;
  preco_promocao?: number;
  is_promocao: boolean;
  image: string;
  quantidade_estoque: number;
  fk_feira: string;
  feira?: {
    nome: string;
  };
}

export default function ProdutosTeste() {
  const { adicionarAoCarrinho, totalItens } = useCarrinho();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<ProdutoAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      console.log('🔍 Buscando produtos reais da API...');
      
      const response = await api.get('/produto');
      
      console.log('✅ Produtos carregados:', response.data.length);
      
      setProdutos(response.data);
    } catch (error: any) {
      console.error('❌ Erro ao buscar produtos:', error);
      setErro('Erro ao carregar produtos. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarAoCarrinho = (produto: ProdutoAPI) => {
    // Converter formato da API para formato do carrinho
    const produtoCarrinho = {
      id: produto.id_produto, // UUID real do banco!
      nome: produto.nome,
      preco: produto.is_promocao && produto.preco_promocao 
        ? produto.preco_promocao 
        : produto.preco,
      imagem: produto.image || 'https://via.placeholder.com/400',
      vendedor: produto.feira?.nome || 'Feira'
    };
    
    adicionarAoCarrinho(produtoCarrinho);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🌱 Produtos Reais</h1>
          <button
            onClick={() => navigate('/carrinho')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"
          >
            🛒 Carrinho ({totalItens})
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Produtos Disponíveis</h2>
          <p className="text-gray-600">Produtos reais do banco de dados - pronto para pagamento!</p>
        </div>

        {/* Loading */}
        {carregando && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Erro ao carregar produtos</p>
            <p>{erro}</p>
            <button
              onClick={buscarProdutos}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de Produtos */}
        {!carregando && !erro && produtos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum produto encontrado.</p>
            <p className="text-gray-500 mt-2">Cadastre produtos no sistema primeiro.</p>
          </div>
        )}

        {!carregando && !erro && produtos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => {
              const precoFinal = produto.is_promocao && produto.preco_promocao
                ? produto.preco_promocao
                : produto.preco;
              
              return (
                <div
                  key={produto.id_produto}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative">
                    <img
                      src={produto.image || 'https://via.placeholder.com/400'}
                      alt={produto.nome}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                      }}
                    />
                    {produto.is_promocao && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        PROMOÇÃO
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {produto.nome}
                    </h3>
                    
                    {produto.descricao && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {produto.descricao}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-3">
                      Feira: {produto.feira?.nome || 'Não informado'}
                    </p>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        {produto.is_promocao && produto.preco_promocao && (
                          <span className="text-sm text-gray-400 line-through block">
                            R$ {produto.preco.toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-green-600">
                          R$ {precoFinal.toFixed(2)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleAdicionarAoCarrinho(produto)}
                        disabled={produto.quantidade_estoque === 0}
                        className={`px-4 py-2 rounded-lg transition font-semibold ${
                          produto.quantidade_estoque === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {produto.quantidade_estoque === 0 ? 'Esgotado' : 'Adicionar'}
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Estoque: {produto.quantidade_estoque} unidades
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botão fixo para ir ao carrinho */}
        {totalItens > 0 && (
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => navigate('/carrinho')}
              className="bg-green-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-green-700 transition font-bold text-lg flex items-center gap-2"
            >
              🛒 Ver Carrinho ({totalItens})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
