import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Loader2, Package } from 'lucide-react';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { Card, CardContent } from '../../components/cards';
import { Button } from '../../components';

const Favoritos: React.FC = () => {
  const navigate = useNavigate();
  const { favoritos, loading, toggleFavorito } = useFavoritos();
  const { adicionarAoCarrinho } = useCarrinho();

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleAdicionarAoCarrinho = (produto: any) => {
    const produtoCarrinho = {
      id: produto.id_produto || produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.image || produto.imagem || '',
      vendedor: produto.feira?.nome || 'Feira',
      id_vendedor: produto.fk_vendedor || '',
      fk_feira: produto.fk_feira || undefined
    };

    adicionarAoCarrinho(produtoCarrinho);
    alert(`✅ ${produto.nome} adicionado ao carrinho!`);
  };

  const handleRemoverFavorito = async (produto_id: string | number) => {
    try {
      await toggleFavorito(produto_id);
      alert('Produto removido dos favoritos!');
    } catch (error: any) {
      alert(' Erro ao remover favorito: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-verde-escuro mx-auto mb-4" />
          <p className="text-gray-600">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
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
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
              <p className="text-gray-600 mt-1">
                {favoritos.length} {favoritos.length === 1 ? 'produto' : 'produtos'} favorito{favoritos.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoritos.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-500 mb-6">
              Adicione produtos aos favoritos para vê-los aqui!
            </p>
            <Button
              onClick={() => navigate('/produtos')}
              className="bg-verde-escuro hover:bg-verde-claro text-white px-6 py-3"
            >
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoritos.map((produto: any) => {
              const produtoId = produto.id_produto || produto.id;
              
              return (
                <Card
                  key={produtoId}
                  className="flex-col items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden relative hover:shadow-lg transition-shadow"
                >
                  {/* Botão de Remover Favorito */}
                  <button
                    onClick={() => handleRemoverFavorito(produtoId)}
                    className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                    title="Remover dos favoritos"
                  >
                    <Heart 
                      className="w-5 h-5 fill-red-500 text-red-500"
                    />
                  </button>
                  
                  {/* Imagem */}
                  <img
                    className="h-[263px] relative self-stretch w-full object-cover"
                    alt={produto.nome}
                    src={produto.image || produto.imagem || "https://via.placeholder.com/263x263/9cb217/ffffff?text=Produto"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(produto.nome);
                    }}
                  />
                  
                  <CardContent className="flex flex-col items-start px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
                    {/* Nome */}
                    <div className="w-full h-auto font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0] mb-2">
                      {produto.nome}
                    </div>
                    
                    {/* Descrição */}
                    {produto.descricao && (
                      <div className="w-full mb-2">
                        <p className="text-[#6b7280] text-sm leading-relaxed [font-family:'Montserrat',Helvetica] line-clamp-2">
                          {produto.descricao}
                        </p>
                      </div>
                    )}
                    
                    {/* Preço */}
                    <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto] mb-3">
                      <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-lg text-center tracking-[0] leading-[normal]">
                        {formatarPreco(produto.preco)}
                      </div>
                    </div>

                    {/* Botão Adicionar ao Carrinho */}
                    <Button
                      onClick={() => handleAdicionarAoCarrinho(produto)}
                      disabled={!produto.disponivel}
                      variant="outline"
                      className={`h-auto w-full border-[#9cb217] px-6 py-2.5 rounded-2xl transition-colors ${
                        produto.disponivel
                          ? 'bg-fundo-claro text-verde-claro hover:bg-verde-claro hover:text-fundo-claro cursor-pointer'
                          : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                        {produto.disponivel ? 'Adicionar à sacola' : 'Indisponível'}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
