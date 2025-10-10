import { ShoppingBagIcon, Loader2, AlertCircle } from "lucide-react";
import { JoinAgriconnectBanner } from '../../../components/JoinAgriconnectBanner';
import React, { useEffect, useState } from "react";
import { Badge } from "../../../components/badge";
import { Card, CardContent } from "../../../components/cards";
import { Button } from "../../../components";
import { Carousel } from '../../../components/Carousel';
import produtoService, { type Produto, type Categoria } from '../../../services/produtoService';

export const MainContentSection = (): React.ReactElement => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                
                const [produtosData, categoriasData] = await Promise.all([
                    produtoService.listarTodos(),
                    produtoService.listarCategorias()
                ]);
                
                setProdutos(produtosData);
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
            className="flex-col min-w-[263px] w-[263px] items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden"
        >
            <img
                className="h-[263px] relative self-stretch w-full object-cover"
                alt={produto.nome}
                src={produto.image || "https://via.placeholder.com/263x263/9cb217/ffffff?text=Produto"}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(produto.nome);
                }}
            />
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
                    variant="outline"
                    className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl mt-2"
                >
                    <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                        Adicionar à sacola
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
                    <div className="w-full max-w-[1108px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[19px] pb-4">
                        {produtosFiltrados.map(produto => renderProdutoCard(produto))}
                    </div>
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
