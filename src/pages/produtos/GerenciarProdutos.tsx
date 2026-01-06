import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowLeft, 
  Trash2, 
  Plus,
  Eye,
  DollarSign,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import produtoService from '../../services/produtoService';
import type { Produto } from '../../services/produtoService';

const GerenciarProdutos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Verificar se é vendedor
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.papeis?.includes('VENDEDOR') || !user.vendedor?.id_vendedor) {
      alert('⚠️ Apenas vendedores podem gerenciar produtos!');
      navigate('/');
      return;
    }
    
    carregarProdutos();
  }, [user, navigate]);
  
  const carregarProdutos = async () => {
    if (!user?.vendedor?.id_vendedor) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await produtoService.buscarPorVendedor(user.vendedor.id_vendedor.toString());
      setProdutos(data);
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      return;
    }
    
    try {
      setDeletingId(id);
      await produtoService.deletar(id.toString());
      
      // Atualizar lista removendo o produto deletado
      setProdutos(produtos.filter(p => p.id !== id));
      
      // Mostrar notificação de sucesso
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50';
      successToast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Produto excluído com sucesso!</span>
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => successToast.remove(), 3000);
      
    } catch (err: any) {
      console.error('Erro ao deletar produto:', err);
      alert(`Erro ao excluir produto: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus produtos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 text-verde-escuro hover:text-verde-claro transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar ao Perfil</span>
          </Link>
          
          <Link
            to="/produtos/cadastro"
            className="inline-flex items-center gap-2 bg-verde-escuro text-white px-6 py-3 rounded-xl hover:bg-verde-claro transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Cadastrar Novo Produto</span>
          </Link>
        </div>

        {/* Título */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-verde-escuro to-verde-claro p-6 text-white">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
                <p className="text-white/90 mt-1">
                  {produtos.length} {produtos.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Lista de Produtos */}
        {produtos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-600 mb-6">
              Comece cadastrando seu primeiro produto para começar a vender!
            </p>
            <Link
              to="/produtos/cadastro"
              className="inline-flex items-center gap-2 bg-verde-escuro text-white px-8 py-3 rounded-xl hover:bg-verde-claro transition-colors"
            >
              <Plus className="w-5 h-5" />
              Cadastrar Primeiro Produto
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              >
                {/* Imagem do Produto */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {produto.image ? (
                    <img
                      src={produto.image}
                      alt={produto.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status de Disponibilidade */}
                  <div className="absolute top-2 right-2">
                    {produto.disponivel ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Disponível
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {produto.nome}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {produto.descricao || 'Sem descrição'}
                  </p>

                  {/* Preço */}
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-verde-escuro" />
                    <span className="text-2xl font-bold text-verde-escuro">
                      R$ {produto.preco?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Estoque */}
                  {produto.quantidade_estoque !== undefined && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span>Estoque: {produto.quantidade_estoque} unidades</span>
                    </div>
                  )}

                  {/* Feira */}
                  {produto.feira && (
                    <div className="mb-4 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="font-medium">Feira:</span> {produto.feira.nome}
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Link
                      to={`/produtos/${produto.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(produto.id, produto.nome)}
                      disabled={deletingId === produto.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {deletingId === produto.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Excluindo...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GerenciarProdutos;
