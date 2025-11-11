import {
  Calendar1Icon,
  ChevronRightIcon,
} from "lucide-react";
import React from "react";
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
      const producers = [
    {
      image: "img/AssociaMamori.png",
      name: "Associaçao Amuri",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/ellipse-6-1.png",
      name: "Maria Núbia",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/ellipse-6-2.png",
      name: "Adriano Garra",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/ellipse-6-3.png",
      name: "Fernando Santos",
    },
  ];
  // Data for subscription cards
  // Data for category filters

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
            alt="Feira da Matriz"
            src="/img/Feira.png"
          />

          <div className="flex flex-col justify-center gap-6 flex-1">
            <h1 className="[font-family:'Inter',Helvetica] font-bold text-texto text-2xl">
              Feira da Matriz
            </h1>
            <h1 className="[font-family:'montserrat'] text-texto text-1xl">
              Toda Quinta-Feira, 08h às 20h
            </h1>
            <div className="flex items-center gap-2">
              <img
                src="/img/Associacao.png"
                alt="Associação Mamori"
                className="w-8 h-8 rounded-full object-cover"
              />
              <h1 className="[font-family:'montserrat'] text-texto text-1xl">
                Associação Mamori
              </h1>
            </div>
            <Button
              variant="outline"
              className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl"
            >
              <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                Marcar ao calendário
              </span>
              <Calendar1Icon className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Subscriptions Section */}
      <section className="flex flex-col w-full items-start gap-4">
        <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl">
          Conheça mais a Feira da Matriz
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base leading-relaxed max-w-4xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium neque magna. Mauris blandit laoreet ligula, eu luctus neque finibus eget. Maecenas vel est ac risus viverra sagittis vitae vitae nulla. Vivamus et interdum ex. Fusce porttitor odio ut ornare consequat. Etiam tempus elementum urna non vulputate. Sed ullamcorper sapien ultricies accumsan scelerisque. Donec placerat tellus id pharetra tempus.
        </p>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base leading-relaxed max-w-4xl">
          Integer et finibus enim. Pellentesque id odio sed ipsum bibendum luctus ut eget nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas risus mauris, hendrerit eget ligula ut, egestas porttitor neque. Vestibulum in nisl ex.
        </p>
      </section>
      {/* Associated Producers Section */}
      <section className="flex flex-col w-full max-w-[467px] items-start gap-2 ">
        <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl">
          Confira quem estará presente
        </h2>
      </section>

      {/* Producers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full ">
        {producers.map((producer, index) => (
          <div
            key={`producer-${index}`}
            className="flex flex-col items-center gap-4"
          >
            <img
              className="w-full h-[263px] object-cover rounded-full"
              alt="Ellipse"
              src={producer.image}
            />
            <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl text-center">
              {producer.name}
            </h3>
          </div>
        ))}
      </div>
      {/* Call to Action Banner */}
      <JoinAgriconnectBanner />
    </main>
  );
};
