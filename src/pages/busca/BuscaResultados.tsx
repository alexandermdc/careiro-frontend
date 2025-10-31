import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Building2, ArrowLeft, Loader2, ShoppingBag, MapPin } from 'lucide-react';
import { useBusca } from '../../contexts/BuscaContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { Card, CardContent } from '../../components/cards';
import { Button } from '../../components';
import { HeaderSection } from '../../components';
import { FooterSection } from '../../components';

const BuscaResultados: React.FC = () => {
  const navigate = useNavigate();
  const { resultados, loading, termoBusca } = useBusca();
  const { adicionarAoCarrinho } = useCarrinho();

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleAdicionarAoCarrinho = (produto: any) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('⚠️ Você precisa estar logado para adicionar produtos ao carrinho!');
      navigate('/login');
      return;
    }

    const produtoCarrinho = {
      id: produto.id_produto,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.image || '',
      vendedor: 'Vendedor',
      id_vendedor: produto.fk_vendedor || '',
    };

    adicionarAoCarrinho(produtoCarrinho);
    alert(`✅ ${produto.nome} adicionado ao carrinho!`);
  };

  const produtos = resultados.filter((r: any) => r.tipo === 'produto');
  const associacoes = resultados.filter((r: any) => r.tipo === 'associacao');

  if (loading) {
    return (
      <>
        <HeaderSection />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-verde-escuro mx-auto mb-4" />
            <p className="text-gray-600">Buscando...</p>
          </div>
        </div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <HeaderSection />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8 text-verde-escuro" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resultados da Busca
              </h1>
              {termoBusca && (
                <p className="text-gray-600 mt-1">
                  Buscando por: <span className="font-semibold">"{termoBusca}"</span>
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {resultados.length} {resultados.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resultados.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Nenhum resultado encontrado
            </h2>
            <p className="text-gray-500 mb-6">
              Tente buscar com outros termos
            </p>
            <Button
              onClick={() => navigate('/produtos')}
              className="bg-verde-escuro hover:bg-verde-claro text-white px-6 py-3"
            >
              Ver Todos os Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Produtos */}
            {produtos.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-6 h-6 text-verde-escuro" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Produtos ({produtos.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {produtos.map((produto: any) => (
                    <Card
                      key={produto.id_produto}
                      className="flex-col items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        className="h-[200px] relative self-stretch w-full object-cover"
                        alt={produto.nome}
                        src={produto.image || "https://via.placeholder.com/200x200/9cb217/ffffff?text=Produto"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/200x200/9cb217/ffffff?text=" + encodeURIComponent(produto.nome);
                        }}
                      />
                      
                      <CardContent className="flex flex-col items-start px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
                        <div className="w-full font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0] mb-2">
                          {produto.nome}
                        </div>
                        
                        {produto.descricao && (
                          <div className="w-full mb-2">
                            <p className="text-[#6b7280] text-sm leading-relaxed [font-family:'Montserrat',Helvetica] line-clamp-2">
                              {produto.descricao}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto] mb-3">
                          <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-lg text-center tracking-[0] leading-[normal]">
                            {formatarPreco(produto.preco)}
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAdicionarAoCarrinho(produto)}
                          disabled={!produto.disponivel}
                          variant="outline"
                          className="h-auto w-full border-[#9cb217] px-4 py-2.5 rounded-2xl transition-colors bg-fundo-claro text-verde-claro hover:bg-verde-claro hover:text-fundo-claro"
                        >
                          <ShoppingBag className="w-5 h-5 mr-2" />
                          <span className="text-sm">Adicionar à sacola</span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Associações */}
            {associacoes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-6 h-6 text-verde-escuro" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Associações ({associacoes.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {associacoes.map((associacao: any) => (
                    <Card
                      key={associacao.id_associacao}
                      className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/associacoes/${associacao.id_associacao}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-verde-claro/10 p-3 rounded-full">
                          <Building2 className="w-6 h-6 text-verde-escuro" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {associacao.nome}
                          </h3>
                          {associacao.descricao && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {associacao.descricao}
                            </p>
                          )}
                          {associacao.endereco && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{associacao.endereco}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
    <FooterSection />
    </>
  );
};

export default BuscaResultados;
