/*eslint-disable @typescript-eslint/no-unused-vars */
import { ShoppingBagIcon, Loader2, AlertCircle, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { JoinAgriconnectBanner } from '../../../components/JoinAgriconnectBanner';
import React, { useEffect, useState } from "react";
import { Badge } from "../../../components/badge";
import { Card, CardContent } from "../../../components/cards";
import { Button } from "../../../components";
import { Carousel } from "../../../components/Carousel";
import produtoService, {
  type Produto as ProdutoOriginal,
  type Categoria,
} from "../../../services/produtoService";
import { useCarrinho } from '../../../contexts/CarrinhoContext';
import { useFavoritos } from '../../../contexts/FavoritosContext';
import { useNavigate } from 'react-router-dom';

// The original `Produto` type seems to be missing fields. Let's extend it.
type Produto = ProdutoOriginal & {
  id_produto: string;
  id_categoria: string;
  is_promocao: boolean;
  preco_promocao?: number;
  fk_vendedor?: string;
};

export const MainContentSection = (): React.ReactElement => {
    const navigate = useNavigate();
    const { adicionarAoCarrinho } = useCarrinho();
    const { isFavorito, toggleFavorito } = useFavoritos();
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const PRODUTOS_POR_PAGINA = 16;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                
                const [produtosData, categoriasData] = await Promise.all([
                    produtoService.listarTodos(),
                    produtoService.listarCategorias()
                ]);

                setProdutos(produtosData as Produto[]);
                setCategorias(categoriasData);
            } catch (err: any) {
                console.error('Erro ao carregar dados:', err);
                setError(err.message || 'Erro ao carregar produtos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const produtosFiltrados = categoriaAtiva
        ? produtos.filter(p => p.id_categoria === categoriaAtiva)
        : produtos;

    // Produtos em destaque (is_promocao e disponível)
    const produtosDestaque = produtos.filter(p => p.is_promocao && p.disponivel);
    
    // Cálculos de paginação
    const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);
    const indiceInicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
    const indiceFim = indiceInicio + PRODUTOS_POR_PAGINA;
    const produtosPaginados = produtosFiltrados.slice(indiceInicio, indiceFim);
    
    // Resetar para página 1 quando mudar categoria
    useEffect(() => {
        setPaginaAtual(1);
    }, [categoriaAtiva]);
    
    const irParaPagina = (pagina: number) => {
        setPaginaAtual(pagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAdicionarAoCarrinho = (produto: Produto) => {
        // Verificar se está logado
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('⚠️ Você precisa estar logado para adicionar produtos ao carrinho!');
            navigate('/login');
            return;
        }

        // Verificar se produto está disponível
        if (!produto.disponivel) {
            alert('⚠️ Este produto não está disponível no momento.');
            return;
        }

        // Converter formato da API para formato do carrinho
        const produtoCarrinho = {
            id: produto.id_produto,
            nome: produto.nome,
            preco: produto.is_promocao && produto.preco_promocao 
                ? produto.preco_promocao 
                : produto.preco,
            imagem: produto.image || '',
            vendedor: produto.feira?.nome || 'Feira',
            id_vendedor: produto.fk_vendedor || '',
            fk_feira: produto.fk_feira || undefined
        };

        adicionarAoCarrinho(produtoCarrinho);
        
        // Feedback visual
        alert(`✅ ${produto.nome} adicionado ao carrinho!`);
    };

    const handleToggleFavorito = async (produto_id: string | number) => {

        
        // Verificar se está logado
        const token = localStorage.getItem('accessToken');

        
        if (!token) {
            console.warn('⚠️ Usuário não autenticado');
            alert('⚠️ Você precisa estar logado para favoritar produtos!');
            navigate('/login');
            return;
        }

        try {
  
            await toggleFavorito(produto_id);
            

            const isFav = isFavorito(produto_id);
 
            
            alert(isFav ? 'Produto adicionado aos favoritos!' : 'Produto removido dos favoritos!');
        } catch (error: any) {
            console.error('❌ Erro no handleToggleFavorito:', error);
            alert('Erro ao atualizar favorito: ' + error.message);
        }
    };

    const formatarPreco = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    if (loading) {
        return (
            <section className="flex flex-col w-full items-center gap-16 px-4 md:px-6 py-16">
                <div className="flex items-center justify-center gap-3 text-verde-escuro">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-lg font-semibold">Carregando produtos...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex flex-col w-full items-center gap-16 px-4 md:px-6 py-16">
                <div className="flex items-center justify-center gap-3 text-red-600 bg-red-50 p-6 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                    <p className="text-base">{error}</p>
                </div>
            </section>
        );
    }

    const renderProdutoCard = (produto: Produto) => (
        <Card
            key={produto.id_produto}
            className="flex-col min-w-[263px] w-[263px] items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden relative"
        >
            {/* Botão de Favorito - Posição absoluta */}
            <button
                onClick={() => handleToggleFavorito(produto.id_produto)}
                className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                title={isFavorito(produto.id_produto) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
                <Heart 
                    className={`w-5 h-5 transition-colors ${
                        isFavorito(produto.id_produto) 
                            ? 'text-gray-400 hover:text-red-400'
                            : 'fill-red-500 text-red-500'
                    }`}
                />
            </button>
            
            {/* Imagem do produto com fallback */}
            {produto.image && (produto.image.startsWith('data:image') || produto.image.startsWith('http')) ? (
                <img
                    className="h-[263px] relative self-stretch w-full object-cover"
                    alt={produto.nome}
                    src={produto.image}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Ocultar imagem se falhar
                        target.style.display = 'none';
                        // Mostrar placeholder
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.placeholder-produto')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'placeholder-produto h-[263px] w-full bg-gray-100 flex items-center justify-center flex-col gap-2';
                            placeholder.innerHTML = `
                                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-gray-500 text-sm">${produto.nome}</span>
                            `;
                            parent.insertBefore(placeholder, target);
                        }
                    }}
                />
            ) : (
                <div className="h-[263px] w-full bg-gray-100 flex items-center justify-center flex-col gap-2">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-500 text-sm">{produto.nome}</span>
                </div>
            )}
            
            <CardContent className="flex flex-col items-start px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-[231px] h-6 mt-[-1.00px] font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                    {produto.nome}
                </div>
                
                {/* Descrição do produto */}
                {produto.descricao && (
                    <div className="w-full mt-2 mb-2">
                        <p className="text-[#6b7280] text-sm leading-relaxed [font-family:'Montserrat',Helvetica] line-clamp-2">
                            {produto.descricao}
                        </p>
                    </div>
                )}
                
                {/* DEBUG - Remover depois */}
                <div className="w-full mb-2 p-2 bg-yellow-50 text-xs">
                    <p>✓ disponivel: {produto.disponivel ? 'true' : 'false'}</p>
                    <p>✓ estoque: {produto.quantidade_estoque}</p>
                </div>
                
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                    {produto.is_promocao && produto.preco_promocao ? (
                        <>
                            <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-normal italic text-[#9f9f9f] text-sm text-center tracking-[0] leading-[normal] line-through">
                                {formatarPreco(produto.preco)}
                            </div>
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
                                {formatarPreco(produto.preco_promocao)}
                            </div>
                        </>
                    ) : (
                        <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
                            {formatarPreco(produto.preco)}
                        </div>
                    )}
                </div>

                <Button
                    onClick={() => handleAdicionarAoCarrinho(produto)}
                    disabled={!produto.disponivel}
                    variant="outline"
                    className={`h-auto w-fit border-[#9cb217] px-6 py-2.5 rounded-2xl mt-2 transition-colors ${
                        produto.disponivel
                            ? 'bg-fundo-claro text-verde-claro hover:bg-verde-claro hover:text-fundo-claro cursor-pointer'
                            : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                >
                    <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                        {produto.disponivel
                            ? 'Adicionar à sacola'
                            : 'Indisponível'}
                    </span>
                    <ShoppingBagIcon className="w-6 h-6 ml-2" />
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <section className="flex flex-col w-full items-center gap-16 px-4 md:px-6 py-16">
            {/* Produtos em Destaque - Usando componente Carousel */}
            {produtosDestaque.length > 0 && (
                <div className="w-full">
                    <div className="w-full max-w-[1108px] mx-auto">
                        <h1 className="w-full [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl mb-6">
                            Produtos em destaque
                        </h1>
                    </div>

                    <Carousel
                        items={produtosDestaque}
                        renderItem={(produto) => renderProdutoCard(produto)}
                        itemsPerPage={4}
                        showControls={true}
                        showIndicators={true}
                    />
                </div>
            )}

            <div className="w-full max-w-[1108px] mx-auto">
                <h1 className="w-full [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl mb-6">
                    Confira nossos Produtos
                </h1>
            </div>

            <div className="w-full flex justify-center mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full max-w-[1108px]">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            onClick={() => setCategoriaAtiva(null)}
                            variant={categoriaAtiva === null ? "default" : "outline"}
                            className={`h-12 px-6 py-[3px] rounded-2xl text-sm font-bold [font-family:'Montserrat',Helvetica] ${
                                categoriaAtiva === null
                                    ? "bg-[#92a916] text-fundo-claro border-[#fafcf9] hover:bg-[#92a916]"
                                    : "bg-fundo-claro text-[#92a916] border-[#92a916] hover:bg-[#92a916] hover:text-fundo-claro"
                            } transition-colors cursor-pointer`}
                        >
                            Todos
                        </Badge>

                        {categorias.map((categoria) => (
                            <Badge
                                key={categoria.id_categoria}
                                onClick={() => setCategoriaAtiva(categoria.id_categoria)}
                                variant={categoriaAtiva === categoria.id_categoria ? "default" : "outline"}
                                className={`h-12 px-6 py-[3px] rounded-2xl text-sm font-bold [font-family:'Montserrat',Helvetica] ${
                                    categoriaAtiva === categoria.id_categoria
                                        ? "bg-[#92a916] text-fundo-claro border-[#fafcf9] hover:bg-[#92a916]"
                                        : "bg-fundo-claro text-[#92a916] border-[#92a916] hover:bg-[#92a916] hover:text-fundo-claro"
                                } transition-colors cursor-pointer`}
                            >
                                {categoria.nome}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full">
                {produtosFiltrados.length > 0 ? (
                    <>
                        <div className="w-full max-w-[1108px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[19px] pb-8">
                            {produtosPaginados.map(produto => renderProdutoCard(produto))}
                        </div>
                        
                        {/* Controles de Paginação */}
                        {totalPaginas > 1 && (
                            <div className="w-full max-w-[1108px] mx-auto flex items-center justify-center gap-2 mt-8">
                                {/* Botão Anterior */}
                                <button
                                    onClick={() => irParaPagina(paginaAtual - 1)}
                                    disabled={paginaAtual === 1}
                                    className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                                        paginaAtual === 1
                                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'border-verde-claro text-verde-claro hover:bg-verde-claro hover:text-white'
                                    }`}
                                    aria-label="Página anterior"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                {/* Números das páginas */}
                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => {
                                    // Mostrar apenas algumas páginas ao redor da atual
                                    if (
                                        numeroPagina === 1 ||
                                        numeroPagina === totalPaginas ||
                                        (numeroPagina >= paginaAtual - 2 && numeroPagina <= paginaAtual + 2)
                                    ) {
                                        return (
                                            <button
                                                key={numeroPagina}
                                                onClick={() => irParaPagina(numeroPagina)}
                                                className={`flex items-center justify-center w-10 h-10 rounded-lg border font-semibold transition-colors ${
                                                    paginaAtual === numeroPagina
                                                        ? 'bg-verde-claro text-white border-verde-claro'
                                                        : 'border-verde-claro text-verde-claro hover:bg-verde-claro hover:text-white'
                                                }`}
                                            >
                                                {numeroPagina}
                                            </button>
                                        );
                                    } else if (
                                        numeroPagina === paginaAtual - 3 ||
                                        numeroPagina === paginaAtual + 3
                                    ) {
                                        return (
                                            <span key={numeroPagina} className="px-2 text-gray-400">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                                
                                {/* Botão Próximo */}
                                <button
                                    onClick={() => irParaPagina(paginaAtual + 1)}
                                    disabled={paginaAtual === totalPaginas}
                                    className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                                        paginaAtual === totalPaginas
                                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'border-verde-claro text-verde-claro hover:bg-verde-claro hover:text-white'
                                    }`}
                                    aria-label="Próxima página"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full max-w-[1108px] mx-auto text-center py-12">
                        <p className="text-texto text-lg">
                            {categoriaAtiva 
                                ? "Nenhum produto encontrado nesta categoria." 
                                : "Nenhum produto cadastrado ainda."}
                        </p>
                    </div>
                )}
            </div>
            
            <JoinAgriconnectBanner />
        </section>
    );
};
