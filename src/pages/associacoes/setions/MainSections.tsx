import React from "react";
import { Button } from "../../../components/button";
import { Card, CardContent } from "../../../components/cards";
import { JoinAgriconnectBanner } from '../../../components/JoinAgriconnectBanner';

const associationsData = [
  {
    id: 1,
    name: "Associação Mamuri",
    image: "https://c.animaapp.com/mfyndft0ii9IQr/img/rectangle-60.png",
    delay: "200ms",
  },
  {
    id: 2,
    name: "Associação São José",
    image: "https://c.animaapp.com/mfyndft0ii9IQr/img/rectangle-60-1.png",
    delay: "400ms",
  },
  {
    id: 3,
    name: "Associação",
    image: "https://c.animaapp.com/mfyndft0ii9IQr/img/rectangle-60-2.png",
    delay: "600ms",
  },
  {
    id: 4,
    name: "Associação",
    image: "https://c.animaapp.com/mfyndft0ii9IQr/img/rectangle-60-3.png",
    delay: "800ms",
  },
  {
    id: 5,
    name: "Associação",
    image: "https://c.animaapp.com/mfyndft0ii9IQr/img/rectangle-60-4.png",
    delay: "1000ms",
  },
  {
    id: 6,
    name: "Associação",
    image: "https://c.animaapp.com/mfyndft0ii9IQr/img/rectangle-60-5.png",
    delay: "1200ms",
  },
];

export const MainContentSection = (): React.ReactElement => {
  return (
    <section className="flex flex-col w-full items-start gap-11 relative py-8 px-4 max-w-[1112px] mx-auto">
      <header>
        <h1 className="w-full [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl mb-6">
          Associações
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {associationsData.map((association) => (
          <Card
            key={association.id}
            className="w-full h-fit flex flex-col items-center gap-6 pt-0 pb-6 px-0 bg-fundo-claro rounded-[30px] overflow-hidden border border-solid border-[#b5b5b5] shadow-[0px_0px_4px_#00000040] transition-transform hover:scale-[1.02] duration-300"
          >
            <CardContent className="p-0 w-full">
              <img
                className="w-full h-[333px] object-cover"
                alt={`${association.name} image`}
                src={association.image}
              />

              <div className="flex items-center justify-center px-6 pt-6 pb-0">
                <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-base text-center tracking-[0] leading-[normal]">
                  {association.name}
                </h3>
              </div>

              <div className="flex justify-center px-6">
                <Button
                  variant="outline"
                  className="w-[248.5px] h-12 bg-fundo-claro rounded-2xl border border-solid border-[#9cb217] hover:bg-verde-claro hover:text-fundo-claro transition-colors duration-300"
                >
                  <span className="font-[number:var(--bot-es-font-weight)] text-verde-claro text-[length:var(--bot-es-font-size)] leading-[var(--bot-es-line-height)] font-bot-es tracking-[var(--bot-es-letter-spacing)] [font-style:var(--bot-es-font-style)] group-hover:text-fundo-claro">
                    Ver mais
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Espaçamento antes do banner */}
      <div className="mt-16 w-full">
        <JoinAgriconnectBanner />
      </div>
    </section>
  );
};
