import { CalendarIcon, MapPinIcon } from "lucide-react";
import { JoinAgriconnectBanner } from '../../../../components/JoinAgriconnectBanner';
import {type JSX, useState, useEffect} from "react";
import { Button } from "../../../../components/button";
import { Card, CardContent } from "../../../../components/cards";
import api from "../../../../services/api";

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

const fairs = [
  {
    image: "/img/pc_uniao.jpg",
    title: "Feira do PC - união e força ",
    location: "Estrada de Autazes Km 14",
    date: "Domingos - 08h às 13h",
    buttonText: "Ver produtos",
    height: "h-[244.41px]",
  },
  {
    image: "/img/feira_empreendedorismo.jpg",
    title: "Feira de Empreendedorismo Rural - Grupo Mãos que Colhem",
    location: "Ramal São José Km 11",
    date: "Sábados - 08h às 13h",
    buttonText: "Ver produtos",
    height: "h-[244.41px]",
  },
  {
    image: "/img/pc_uniao.jpg",
    title: "Feira do PC - união e força ",
    location: "Estrada de Autazes Km 14",
    date: "Domingos - 08h às 13h",
    buttonText: "Ver produtos",
    height: "h-[244.41px]",
  },
  {
    image: "/img/feira_empreendedorismo.jpg",
    title: "Feira de Empreendedorismo Rural - Grupo Mãos que Colhem",
    location: "Ramal São José Km 11",
    date: "Domingos - 08h às 13h",
    buttonText: "Ver produtos",
    height: "h-[263px]",
  },
];

const categories = [
  {
    title: "Legumes",
    backgroundImage:
      "/img/card-categorias.png",
  },
  {
    title: "Frutas",
    backgroundImage:
      "/img/card-categorias.png",
  },
  {
    title: "Verduras",
    backgroundImage:
      "/img/card-categorias.png",
  },
];

const subscriptions = [
  {
    image: "/img/semanal.png",
    title: "Assinatura Semanal",
    price: "R$ 45,00",
  },
  {
    image: "/img/quinzenal.png",
    title: "Assinatura Quinzenal",
    price: "R$ 80,00",
  },
  {
    image: "/img/mensal.png",
    title: "Assinatura Mensal",
    price: "R$ 150,00",
  },
  {
    image: "/img/premium.png",
    title: "Assinatura Premium",
    price: "R$ 200,00",
  },
];

const howItWorksSteps = [
  {
    image: "/img/produtoresCard.png",
    description:
      "Produtores cadastram sua colheita de forma simples e rápida, direto da roça.",
    imageWidth: "w-[108px]",
    height: "h-[315.8px]",
    gap: "gap-4",
    justify: "justify-center",
  },
  {
    image: "/img/plataformaCard.png",
    description:
      "Comércios, feiras e consumidores encontram rapidamente o que precisam pelo app.",
    imageWidth: "w-[77px]",
    height: "h-[316px]",
    gap: "gap-[30px]",
    justify: "",
  },
  {
    image: "/img/Legumes.png",
    description:
      "O comprador recebe produtos frescos direto da origem, reduzindo custos e fortalecendo a economia local.",
    imageWidth: "w-[236.83px] ml-[-1.92px] mr-[-1.92px]",
    height: "h-[315.8px]",
    gap: "gap-4",
    justify: "justify-center",
  },
];

export const MainContentSection = (): JSX.Element => {
  const [produtosDestaque, setProdutosDestaque] = useState<ProdutoAPI[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  useEffect(() => {
    buscarProdutosDestaque();
  }, []);

  const buscarProdutosDestaque = async () => {
    try {
      setCarregandoProdutos(true);
      const response = await api.get('/produto');
      
      // Pegar apenas os 4 primeiros produtos
      const primeirosProdutos = response.data.slice(0, 4);
      setProdutosDestaque(primeirosProdutos);
      
    } catch (error) {
    } finally {
      setCarregandoProdutos(false);
    }
  };

  return (
    <section className="flex flex-col w-full items-center gap-8 md:gap-12 lg:gap-16 px-4 md:px-6 py-8 md:py-12 lg:py-16">
      {/* Produtos em Destaque */}
      <div className="w-full">
        <div className="w-full max-w-[1108px] mx-auto mb-6 md:mb-8">
          <h2 className="text-left font-bold text-verde-escuro text-xl md:text-2xl lg:text-3xl">
            Produtos e associações em destaque
          </h2>
        </div>

        <div className="w-full max-w-[1108px] mx-auto">
          {carregandoProdutos ? (
            // Loading state
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-verde-escuro"></div>
              <p className="mt-3 text-sm md:text-base text-gray-600">Carregando produtos...</p>
            </div>
          ) : produtosDestaque.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <p className="text-sm md:text-base text-gray-600">Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            // Grid responsivo de produtos
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {produtosDestaque.map((produto) => {
                const precoFinal = produto.is_promocao && produto.preco_promocao
                  ? produto.preco_promocao
                  : produto.preco;
                const temPromocao = produto.is_promocao && produto.preco_promocao;

                return (
                  <Card
                    key={produto.id_produto}
                    className="flex flex-col w-full items-start gap-3 md:gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-2xl md:rounded-[25px] overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative w-full">
                      <img
                        className="h-[200px] sm:h-[220px] md:h-[263px] relative self-stretch w-full object-cover"
                        alt={produto.nome}
                        src={produto.image|| 'https://via.placeholder.com/263x263/9cb217/ffffff?text=Produto'}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(produto.nome);
                        }}
                      />
                      {temPromocao && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold">
                          PROMOÇÃO
                        </span>
                      )}
                    </div>
                    
                    <CardContent className="flex flex-col items-start px-3 md:px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
                      <div className="w-full font-medium text-texto text-sm md:text-base leading-tight relative [font-family:'Montserrat',Helvetica] tracking-[0] mb-2">
                        {produto.nome}
                      </div>
                      <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                        {temPromocao && (
                          <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-normal italic text-[#9f9f9f] text-xs md:text-sm text-center tracking-[0] leading-[normal] line-through">
                            R$ {produto.preco.toFixed(2)}
                          </div>
                        )}
                        <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base md:text-lg text-center tracking-[0] leading-[normal]">
                          R$ {precoFinal.toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Feiras */}
      <div className="w-full">
        <div className="w-full max-w-[1108px] mx-auto flex flex-col items-start gap-2 mb-6 md:mb-8">
          <h2 className="text-left font-bold text-verde-escuro text-xl md:text-2xl lg:text-3xl">
            Conheça nossas feiras
          </h2>
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-sm md:text-base tracking-[0] leading-[normal] text-left">
            Compre aqui e retire os alimentos fresquinhos nas feiras
          </p>
        </div>

        <div className="w-full max-w-[1108px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {fairs.map((fair, index) => (
            <Card
              key={index}
              className="flex flex-col w-full items-center gap-3 md:gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-2xl md:rounded-[25px] overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                className="h-[200px] sm:h-[220px] md:h-[244px] relative self-stretch w-full object-cover"
                alt={fair.title}
                src={fair.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/263x244/1d4510/ffffff?text=" + encodeURIComponent(fair.title);
                }}
              />
              <CardContent className="flex flex-col items-start gap-2 px-3 md:px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-full font-bold text-texto text-sm md:text-base leading-tight relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                  {fair.title}
                </div>
                <div className="relative w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
                    <div className="flex-1 text-[#5a5a5a] text-xs md:text-sm font-normal [font-family:'Montserrat',Helvetica]">
                      {fair.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
                    <div className="[font-family:'Montserrat',Helvetica] font-normal text-[#5a5a5a] text-xs md:text-sm tracking-[0] leading-[normal]">
                      {fair.date}
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-center w-full px-3 md:px-4">
                <Button
                  className="h-10 md:h-12 w-full inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 bg-fundo-claro rounded-xl md:rounded-2xl overflow-hidden border border-solid border-[#9cb217] hover:bg-verde-claro/10 transition-colors"
                  variant="outline"
                >
                  <span className="font-medium text-verde-claro text-xs md:text-sm text-center whitespace-nowrap">
                    {fair.buttonText}
                  </span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full">
        <div className="w-full max-w-[1108px] mx-auto flex flex-col items-start gap-2 mb-8">
        <h2 className="mt-[-1.00px] text-left font-t-tulos font-[number:var(--t-tulos-font-weight)] text-verde-escuro text-[length:var(--t-tulos-font-size)] tracking-[var(--t-tulos-letter-spacing)] leading-[var(--t-tulos-line-height)] [font-style:var(--t-tulos-font-style)]">
          Categorias de produtos
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] text-left">
          Veja nossos produtos de acordo com as suas necessidades
        </p>
        </div>

        <div className="flex items-center justify-center gap-[19px] w-full overflow-x-auto pb-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="min-w-[263px] w-[263px] h-[200px] items-center justify-center px-[73px] py-[85px] flex relative rounded-[25px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              background: `linear-gradient(0deg, rgba(28, 90, 22, 0.77) 0%, rgba(28, 90, 22, 0.77) 100%), url(${category.backgroundImage}) 50% 50% / cover`
            }}
          >
            <div className="relative w-fit mt-[-0.50px] [font-family:'Montserrat',Helvetica] font-bold text-fundo-claro text-2xl tracking-[0] leading-[normal]">
              {category.title}
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="w-full">
        <div className="w-full max-w-[1108px] mx-auto flex flex-col items-start gap-2 mb-8">
        <h2 className="mt-[-1.00px] text-left font-t-tulos font-[number:var(--t-tulos-font-weight)] text-verde-escuro text-[length:var(--t-tulos-font-size)] tracking-[var(--t-tulos-letter-spacing)] leading-[var(--t-tulos-line-height)] [font-style:var(--t-tulos-font-style)]">
          Assinaturas
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] text-left">
          Os melhores produtos sempre na sua casa
        </p>
        </div>

  <div className="flex items-center justify-center gap-5 w-full overflow-x-auto pb-4">
        {subscriptions.map((subscription, index) => (
          <Card
            key={index}
            className="flex-col min-w-[263px] w-[263px] items-center gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden"
          >
            <img
              className="h-[263px] relative self-stretch w-full object-cover"
              alt={subscription.title}
              src={subscription.image}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(subscription.title);
              }}
            />
            <CardContent className="flex flex-col items-start px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
              <div className="w-[231px] h-6 mt-[-1.00px] font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                {subscription.title}
              </div>
              <div className="flex w-[155.98px] items-center gap-2 relative flex-[0_0_auto]">
                <div className="relative w-[79px] h-5">
                  <div className="absolute h-5 top-0 left-0 [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
                    {subscription.price}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      <div className="w-full">
        <div className="w-full max-w-[1108px] mx-auto flex flex-col items-start gap-2 mb-8">
        <h2 className="mt-[-1.00px] text-left font-t-tulos font-[number:var(--t-tulos-font-weight)] text-verde-escuro text-[length:var(--t-tulos-font-size)] tracking-[var(--t-tulos-letter-spacing)] leading-[var(--t-tulos-line-height)] [font-style:var(--t-tulos-font-style)]">
          Como funciona o Agriconnect
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] text-left">
          Entenda o que fazemos e quem está por trás disso tudo
        </p>
        </div>

        <div className="flex items-center justify-center gap-10 w-full overflow-x-auto pb-4">
        {howItWorksSteps.map((step, index) => (
          <Card
            key={index}
            className={`flex flex-col min-w-[265px] w-[265px] ${step.height} items-center ${step.justify} ${step.gap} px-4 py-6 relative bg-fundo-claro rounded-[25px] overflow-hidden border border-solid border-[#b5b5b5]`}
          >
            <CardContent className="flex flex-col items-center gap-4 p-0">
              <div className="relative self-stretch mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl text-center tracking-[0] leading-[normal]">
              </div>
              <img
                className={`${step.imageWidth} object-cover relative h-[121.8px]`}
                src={step.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/120x120/9cb217/ffffff?text="
                }}
              />
              <div className="relative self-stretch [font-family:'Montserrat',Helvetica] font-normal text-texto text-sm text-center tracking-[0] leading-[normal]">
                {step.description}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      <JoinAgriconnectBanner />
    </section>
  );
};
