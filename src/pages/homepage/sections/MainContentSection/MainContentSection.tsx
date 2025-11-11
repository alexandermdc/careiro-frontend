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
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-57.png",
    title: "Feira da Matriz",
    location: "Centro da cidade",
    date: "Sábados",
    buttonText: "Ver produtos",
    height: "h-[244.41px]",
  },
  {
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-57-1.png",
    title: "Feira do Produtor",
    location: "Praça da Alimentação",
    date: "Domingos",
    buttonText: "Ver produtos",
    height: "h-[263px]",
  },
  {
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-57-2.png",
    title: "Feira Orgânica",
    location: "Parque Municipal",
    date: "Terças",
    buttonText: "Ver produtos",
    height: "h-[263px]",
  },
  {
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-57-3.png",
    title: "Feira da Agricultura",
    location: "Mercado Central",
    date: "Quintas",
    buttonText: "Ver produtos",
    height: "h-[263px]",
  },
];

const categories = [
  {
    title: "Legumes",
    backgroundImage:
      "https://c.animaapp.com/meda5qjaouVHG5/img/card-categorias-2.png",
  },
  {
    title: "Frutas",
    backgroundImage:
      "https://c.animaapp.com/meda5qjaouVHG5/img/card-categorias-2.png",
  },
  {
    title: "Verduras",
    backgroundImage:
      "https://c.animaapp.com/meda5qjaouVHG5/img/card-categorias-2.png",
  },
];

const subscriptions = [
  {
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56-4.png",
    title: "Assinatura Semanal",
    price: "R$ 45,00",
  },
  {
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56-5.png",
    title: "Assinatura Quinzenal",
    price: "R$ 80,00",
  },
  {
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56-6.png",
    title: "Assinatura Mensal",
    price: "R$ 150,00",
  },
  {
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56-7.png",
    title: "Assinatura Premium",
    price: "R$ 200,00",
  },
];

const howItWorksSteps = [
  {
    number: "1",
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/image-1.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium neque magna. Mauris blandit laoreet ligula, eu luctus neque finibus eget.",
    imageWidth: "w-[108px]",
    height: "h-[315.8px]",
    gap: "gap-4",
    justify: "justify-center",
  },
  {
    number: "2",
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/image-2.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium neque magna.",
    imageWidth: "w-[77px]",
    height: "h-[316px]",
    gap: "gap-[30px]",
    justify: "",
  },
  {
    number: "3",
    image: "https://c.animaapp.com/meda5qjaouVHG5/img/image-3.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium neque magna. Mauris blandit laoreet ligula, eu luctus neque finibus eget.",
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
    <section className="flex flex-col w-full items-center gap-16 px-4 md:px-6 py-16">
      <div className="w-full">
        <div className="w-full max-w-[1108px] mx-auto">
          <h2 className="mb-8 text-left font-t-tulos font-[number:var(--t-tulos-font-weight)] text-verde-escuro text-[length:var(--t-tulos-font-size)] tracking-[var(--t-tulos-letter-spacing)] leading-[var(--t-tulos-line-height)] [font-style:var(--t-tulos-font-style)]">
            Produtos e associações em destaque
          </h2>
        </div>

        <div className="w-full max-w-[1108px] mx-auto flex items-center justify-center gap-[19px]">
          {carregandoProdutos ? (
            // Loading state
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-verde-escuro"></div>
              <p className="mt-2 text-gray-600">Carregando produtos...</p>
            </div>
          ) : produtosDestaque.length === 0 ? (
            // Empty state
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            // Produtos reais do banco
            produtosDestaque.map((produto) => {
              const precoFinal = produto.is_promocao && produto.preco_promocao
                ? produto.preco_promocao
                : produto.preco;
              const temPromocao = produto.is_promocao && produto.preco_promocao;

              return (
                <Card
                  key={produto.id_produto}
                  className="flex-col min-w-[263px] w-[263px] items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden"
                >
                  <div className="relative w-full">
                    <img
                      className="h-[263px] relative self-stretch w-full object-cover"
                      alt={produto.nome}
                      src={produto.image|| 'https://via.placeholder.com/263x263/9cb217/ffffff?text=Produto'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(produto.nome);
                      }}
                    />
                    {temPromocao && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        PROMOÇÃO
                      </span>
                    )}
                  </div>
                  
                  <CardContent className="flex flex-col items-start px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="w-[231px] h-6 mt-[-1.00px] font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                      {produto.nome}
                    </div>
                    <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                      {temPromocao && (
                        <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-normal italic text-[#9f9f9f] text-sm text-center tracking-[0] leading-[normal] line-through">
                          R$ {produto.preco.toFixed(2)}
                        </div>
                      )}
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
                        R$ {precoFinal.toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="w-full max-w-[1108px] mx-auto flex flex-col items-start gap-2 mb-8">
        <h2 className="mt-[-1.00px] text-left font-t-tulos font-[number:var(--t-tulos-font-weight)] text-verde-escuro text-[length:var(--t-tulos-font-size)] tracking-[var(--t-tulos-letter-spacing)] leading-[var(--t-tulos-line-height)] [font-style:var(--t-tulos-font-style)]">
          Conheça nossas feiras
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] text-left">
          Compre aqui e retire os alimentos fresquinhos nas feiras
        </p>
        </div>

            <div className="w-full max-w-[1108px] mx-auto flex items-center justify-center gap-[19px] pb-4">
        {fairs.map((fair, index) => (
          <Card
            key={index}
            className={`flex-col min-w-[263px] ${index === 0 ? "w-[263px]" : "w-[283px]"} items-center gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden`}
          >
            <img
              className={`${fair.height} relative self-stretch w-full object-cover`}
              alt={fair.title}
              src={fair.image}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/263x244/1d4510/ffffff?text=" + encodeURIComponent(fair.title);
              }}
            />
            <CardContent className="flex flex-col items-start gap-2 px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
              <div className="w-[231px] h-6 mt-[-1.00px] font-bold text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                {fair.title}
              </div>
              <div className="relative w-[217px] h-[52px]">
                <div className="absolute w-[219px] h-6 top-0 left-0">
                  <MapPinIcon className="absolute w-6 h-6 top-0 left-0" />
                  <div className="absolute w-[185px] h-6 top-0 left-8 font-textos-curtos font-[number:var(--textos-curtos-font-weight)] text-[#5a5a5a] text-[length:var(--textos-curtos-font-size)] tracking-[var(--textos-curtos-letter-spacing)] leading-[var(--textos-curtos-line-height)] [font-style:var(--textos-curtos-font-style)]">
                    {fair.location}
                  </div>
                </div>
                <div className="absolute w-[122px] h-6 top-7 left-0">
                  <CalendarIcon className="absolute w-6 h-6 top-0 left-0" />
                  <div className="absolute w-[88px] h-6 top-0 left-8 [font-family:'Montserrat',Helvetica] font-normal text-[#5a5a5a] text-sm tracking-[0] leading-[normal]">
                    {fair.date}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-center w-full px-4">
              <Button
                className="h-12 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-fundo-claro rounded-2xl overflow-hidden border border-solid border-[#9cb217]"
                variant="outline"
              >
                <span className="font-[number:var(--bot-es-font-weight)] text-verde-claro text-[length:var(--bot-es-font-size)] text-center leading-[var(--bot-es-line-height)] whitespace-nowrap font-bot-es tracking-[var(--bot-es-letter-spacing)] [font-style:var(--bot-es-font-style)]">
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
                {step.number}
              </div>
              <img
                className={`${step.imageWidth} object-cover relative h-[121.8px]`}
                alt={`Passo ${step.number}`}
                src={step.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/120x120/9cb217/ffffff?text=" + step.number;
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
