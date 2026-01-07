import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PageLayout } from '../../components/PageLayout';
import categoriaService from '../../services/categoriaService';
import vendedorService from '../../services/vendedorService';
import feiraService from '../../services/feiraService';
import produtoService from '../../services/produtoService';
import pedidoService from '../../services/pedidoService';
import type { CreateCategoriaData } from '../../services/categoriaService';
import type { LucideIcon } from 'lucide-react';
import { 
  Store, 
  UserPlus, 
  Package, 
  Users, 
  BarChart3,
  ShoppingCart,
  Settings,
  Shield,
  Tag,
  X,
  Save,
  Building2
} from 'lucide-react';

interface AdminCard {
  title: string;
  description: string;
  icon: LucideIcon;
  link?: string;
  onClick?: () => void;
  color: string;
  iconColor: string;
  badge: string;
}

const PainelAdmin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const [errorCategoria, setErrorCategoria] = useState('');
  
  // Estados para totais
  const [totalVendedores, setTotalVendedores] = useState<number>(0);
  const [totalFeiras, setTotalFeiras] = useState<number>(0);
  const [totalProdutos, setTotalProdutos] = useState<number>(0);
  const [totalPedidos, setTotalPedidos] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Verificar se é admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      alert('⚠️ Acesso negado! Apenas administradores podem acessar este painel.');
      navigate('/');
      return;
    }
  }, [user, isAdmin, navigate]);

  // Carregar estatísticas
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setLoadingStats(true);
        
        // Carregar dados com tratamento de erro individual
        const resultados = await Promise.allSettled([
          vendedorService.listarTodos(),
          feiraService.listarTodas(),
          produtoService.listarTodos(),
          pedidoService.listarTodos()
        ]);
        
        // Processar resultados com fallback para 0 em caso de erro
        const vendedores = resultados[0].status === 'fulfilled' ? resultados[0].value : [];
        const feiras = resultados[1].status === 'fulfilled' ? resultados[1].value : [];
        const produtos = resultados[2].status === 'fulfilled' ? resultados[2].value : [];
        const pedidos = resultados[3].status === 'fulfilled' ? resultados[3].value : [];
        
        setTotalVendedores(vendedores.length);
        setTotalFeiras(feiras.length);
        setTotalProdutos(produtos.length);
        setTotalPedidos(pedidos.length);
        
        // Log de avisos para erros
        if (resultados[1].status === 'rejected') {
          console.warn('⚠️ Não foi possível carregar feiras (backend retornou erro 500)');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAdmin) {
      carregarEstatisticas();
    }
  }, [isAdmin]);

  const handleCriarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nomeCategoria.trim()) {
      setErrorCategoria('Nome da categoria é obrigatório');
      return;
    }

    try {
      setLoadingCategoria(true);
      setErrorCategoria('');
      
      const data: CreateCategoriaData = {
        nome: nomeCategoria.trim()
      };
      
      await categoriaService.criar(data);
      
      // Mostrar toast de sucesso
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform translate-x-full transition-transform duration-300';
      successToast.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="bg-white/20 p-1 rounded-full">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold">Categoria criada!</p>
            <p class="text-sm opacity-90">A categoria foi cadastrada com sucesso</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(successToast);
      setTimeout(() => successToast.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        successToast.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(successToast), 300);
      }, 4000);
      
      // Limpar e fechar modal
      setNomeCategoria('');
      setShowCategoriaModal(false);
      
    } catch (err: any) {
      setErrorCategoria(err.message || 'Erro ao criar categoria');
    } finally {
      setLoadingCategoria(false);
    }
  };

  const adminCards: AdminCard[] = [
    {
      title: 'Cadastrar Feira',
      description: 'Adicione novas feiras e mercados ao sistema',
      icon: Store,
      link: '/feiras/cadastro',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
      badge: 'Cadastro'
    },
    {
      title: 'Cadastrar Vendedor',
      description: 'Registre novos vendedores na plataforma',
      icon: UserPlus,
      link: '/vendedor/cadastro',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
      badge: 'Cadastro'
    },
    {
      title: 'Cadastrar Categoria',
      description: 'Adicione novas categorias de produtos',
      icon: Tag,
      onClick: () => setShowCategoriaModal(true),
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      iconColor: 'text-yellow-600',
      badge: 'Cadastro'
    },
    {
      title: 'Gerenciar Associações',
      description: 'Visualize, cadastre e edite associações',
      icon: Building2,
      link: '/admin/associacoes',
      color: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
      iconColor: 'text-teal-600',
      badge: 'Gestão'
    },
    {
      title: 'Gerenciar Produtos',
      description: 'Visualize e administre produtos cadastrados',
      icon: Package,
      link: '/produtos',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
      badge: 'Gestão'
    },
    {
      title: 'Gerenciar Feiras',
      description: 'Administre todas as feiras cadastradas',
      icon: Store,
      link: '/feiras',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600',
      badge: 'Gestão'
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Visualize e administre clientes e vendedores',
      icon: Users,
      link: '/dashboard',
      color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200',
      iconColor: 'text-cyan-600',
      badge: 'Gestão'
    },
    {
      title: 'Relatórios',
      description: 'Acesse relatórios e estatísticas do sistema',
      icon: BarChart3,
      link: '/dashboard',
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600',
      badge: 'Análise'
    },
  ];

  const statsCards = [
    { 
      label: 'Total de Vendedores', 
      value: loadingStats ? '...' : totalVendedores.toString(), 
      icon: UserPlus, 
      color: 'bg-verde-escuro' 
    },
    { 
      label: 'Total de Feiras', 
      value: loadingStats ? '...' : totalFeiras.toString(), 
      icon: Store, 
      color: 'bg-blue-600' 
    },
    { 
      label: 'Total de Produtos', 
      value: loadingStats ? '...' : totalProdutos.toString(), 
      icon: Package, 
      color: 'bg-purple-600' 
    },
    { 
      label: 'Total de Pedidos', 
      value: loadingStats ? '...' : totalPedidos.toString(), 
      icon: ShoppingCart, 
      color: 'bg-orange-600' 
    },
  ];

  return (
    <PageLayout>
      {/* Modal de Cadastro de Categoria */}
      {showCategoriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Nova Categoria</h2>
                    <p className="text-white/80 text-sm">Adicione uma categoria de produtos</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCategoriaModal(false);
                    setNomeCategoria('');
                    setErrorCategoria('');
                  }}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                  disabled={loadingCategoria}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <form onSubmit={handleCriarCategoria} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={nomeCategoria}
                  onChange={(e) => {
                    setNomeCategoria(e.target.value);
                    setErrorCategoria('');
                  }}
                  placeholder="Ex: Frutas, Verduras, Legumes..."
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 transition-all ${
                    errorCategoria ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  disabled={loadingCategoria}
                  autoFocus
                />
                {errorCategoria && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errorCategoria}
                  </p>
                )}
              </div>

              {/* Footer do Modal */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoriaModal(false);
                    setNomeCategoria('');
                    setErrorCategoria('');
                  }}
                  disabled={loadingCategoria}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingCategoria || !nomeCategoria.trim()}
                  className="flex-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingCategoria ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Criar Categoria
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header com Gradiente */}
        <div className="bg-gradient-to-r from-verde-escuro to-verde-claro text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                <p className="text-green-50 mt-1">Bem-vindo, {user?.nome}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Título da Seção */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ações Administrativas</h2>
            <p className="text-gray-600">Gerencie cadastros e visualize informações do sistema</p>
          </div>

          {/* Grid de Cards de Ações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card, index) => {
              const cardContent = (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.iconColor} bg-white p-3 rounded-lg shadow-sm`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      card.badge === 'Cadastro' ? 'bg-green-100 text-green-700' :
                      card.badge === 'Gestão' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {card.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600">
                    {card.description}
                  </p>

                  <div className="mt-4 flex items-center text-sm font-medium text-verde-escuro">
                    Acessar
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </>
              );

              if (card.link) {
                return (
                  <Link
                    key={index}
                    to={card.link}
                    className={`${card.color} rounded-xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-md transform hover:-translate-y-1`}
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <button
                  key={index}
                  onClick={card.onClick}
                  type="button"
                  className={`${card.color} rounded-xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-md transform hover:-translate-y-1 text-left w-full`}
                >
                  {cardContent}
                </button>
              );
            })}
          </div>

          {/* Seção de Configurações */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-900">Configurações do Sistema</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">Status do Sistema</p>
                <p className="text-lg font-bold text-green-600">✓ Operacional</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">Última Atualização</p>
                <p className="text-lg font-bold text-gray-900">10/12/2025</p>
              </div>
            </div>
          </div>

          {/* Info de Acesso */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-1">Acesso Restrito</p>
                <p className="text-sm text-yellow-800">
                  Este painel é exclusivo para administradores. Todas as ações são registradas no sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PainelAdmin;
