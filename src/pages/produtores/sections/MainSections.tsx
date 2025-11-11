import {
  ChevronRightIcon,
  MessageCircleIcon,
  ShoppingBagIcon,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../components/bradcrumb";
import { Button } from "../../../components/button";
import { JoinAgriconnectBanner } from "../../../components/JoinAgriconnectBanner";

export const MainContentSection = (): React.ReactElement => {
  // Data for subscription cards

  const products = [
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/rectangle-10.png",
      name: "Abóbora (kg)",
      price: "R$8,55",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/rectangle-10-1.png",
      name: "Banana Prata (kg)",
      price: "R$8,70",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/rectangle-10-2.png",
      name: "Limão Tahiti (kg)",
      price: "R$8,00",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/rectangle-10-3.png",
      name: "Maçã verde (unid)",
      price: "R$2,60",
    },
  ];

  // Data for category filters
  const categories = [
    { name: "Legumes", active: true },
    { name: "Frutas", active: false },
    { name: "Verduras", active: false },
  ];

  return (
    <main className="flex flex-col w-full max-w-[1112px] mx-auto items-start gap-11 px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-sm font-normal text-texto [font-family:'Montserrat',Helvetica]"
              >
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon className="w-2 h-2" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-sm font-normal text-texto [font-family:'Montserrat',Helvetica]"
              >
                Associação
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <img
                className="w-[2.75px] h-[5.83px]"
                alt="Vector"
                src="https://c.animaapp.com/mfyaim5kgxckXx/img/vector.svg"
              />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-sm font-normal text-texto [font-family:'Montserrat',Helvetica]">
                Text
              </span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Association Profile Section */}
      <section className="relative w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          <img
            className="w-full lg:w-[357px] h-[357px] object-cover rounded-lg"
            alt="Produtor Marcelo Mamori"
            src="img/ImgExample.png"
          />

          <div className="flex flex-col gap-6 flex-1">
            <h1 className="[font-family:'Inter',Helvetica] font-bold text-texto text-2xl">
              Marcelo Mamori
            </h1>

            <Button
              variant="outline"
              className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl"
            >
              <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                Chat
              </span>
              <MessageCircleIcon className="w-6 h-6 ml-2" />
            </Button>

            <div className="flex flex-col gap-2">
              <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-base">
                Descrição
              </h2>
              <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-sm leading-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                pretium neque magna. Mauris blandit laoreet ligula, eu luctus
                neque finibus eget. Maecenas vel est ac risus viverra sagittis
                vitae vitae nulla. Vivamus et interdum ex. Fusce porttitor odio
                ut ornare consequat. Etiam tempus elementum urna non vulputate.
                Sed ullamcorper sapien ultricies accumsan scelerisque. Donec
                placerat tellus id pharetra tempus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscriptions Section */}
      <section className="flex flex-col w-full max-w-[467px] items-start gap-2 ">
        <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl">
          Produtos do Marcelo Mamori
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base">
          Os melhores produtos sempre na sua casa
        </p>
      </section>
      {/* Category Filters and Product Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full ">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category, index) => (
            <Badge
              key={`category-${index}`}
              variant={category.active ? "default" : "outline"}
              className={`h-12 px-6 py-[3px] rounded-2xl text-sm font-bold [font-family:'Montserrat',Helvetica] ${
                category.active
                  ? "bg-[#92a916] text-fundo-claro border-[#fafcf9] hover:bg-[#92a916]"
                  : "bg-fundo-claro text-[#92a916] border-[#92a916] hover:bg-[#92a916] hover:text-fundo-claro"
              } transition-colors cursor-pointer`}
            >
              {category.name}
            </Badge>
          ))}
        </div>
        <p className="[font-family:'Inter',Helvetica] font-normal text-verde-escuro text-sm">
          8 produtos
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[53px] gap-y-11 w-full ">
        {products.map((product, index) => (
          <div key={`product-${index}`} className="flex gap-4">
            <img
              className="w-[263px] h-[270px] object-cover rounded-lg flex-shrink-0"
              alt="Rectangle"
              src={product.image}
            />
            <div className="flex flex-col gap-4 pt-6">
              <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-base">
                {product.name}
              </h3>
              <p className="[font-family:'Inter',Helvetica] font-bold text-verde-escuro text-base">
                {product.price}
              </p>
              <Button
                variant="outline"
                className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl"
              >
                <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                  Adicionar à sacola
                </span>
                <ShoppingBagIcon className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Banner */}
      <JoinAgriconnectBanner />
    </main>
  );
};
