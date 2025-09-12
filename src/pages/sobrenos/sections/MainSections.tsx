import {type JSX} from "react";
import { Button } from "../../../components/button";
import { Card, CardContent } from "../../../components/cards";

const contentSections = [
  {
    title: "O que é o projeto?",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus tincidunt pharetra. Morbi nec venenatis tortor, sit amet egestas nisi. Morbi consequat justo augue, at vestibulum purus condimentum id. Duis felis magna, placerat vel lacus a, aliquam aliquet ex. Etiam id lectus justo. Donec pellentesque ipsum a nisl dapibus, non hendrerit enim gravida. Maecenas vel est ac risus viverra sagittis vitae vitae nulla. Vivamus et interdum ex. Fusce porttitor odio ut ornare consequat. Etiam tempus elementum urna non vulputate. Sed ullamcorper sapien ultricies accumsan scelerisque. Donec placerat tellus id pharetra tempus.",
  },
  {
    title: "Quem faz parte?",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus tincidunt pharetra. Morbi nec venenatis tortor, sit amet egestas nisi. Morbi consequat justo augue, at vestibulum purus condimentum id. Duis felis magna, placerat vel lacus a, aliquam aliquet ex. Etiam id lectus justo. Donec pellentesque ipsum a nisl dapibus, non hendrerit enim gravida. Maecenas vel est ac risus viverra sagittis vitae vitae nulla. Vivamus et interdum ex. Fusce porttitor odio ut ornare consequat. Etiam tempus elementum urna non vulputate. Sed ullamcorper sapien ultricies accumsan scelerisque. Donec placerat tellus id pharetra tempus.\nInteger et finibus enim. Pellentesque id odio sed ipsum bibendum luctus ut eget nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas risus mauris, hendrerit eget ligula ut, egestas porttitor neque. Vestibulum in nisl ex.",
  },
];

const participantTypes = [
  {
    title: "Produtores",
    image: "https://c.animaapp.com/mfh1vpp1e8a9vm/img/image-4.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus tincidunt pharetra. Morbi nec venenatis tortor, sit amet egestas nisi. Morbi consequat justo augue, at vestibulum purus condimentum id. Duis felis magna, placerat vel lacus a, aliquam aliquet ex.",
  },
  {
    title: "Associações",
    image: "https://c.animaapp.com/mfh1vpp1e8a9vm/img/image-5.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus tincidunt pharetra. Morbi nec venenatis tortor, sit amet egestas nisi. Morbi consequat justo augue, at vestibulum purus condimentum id. Duis felis magna, placerat vel lacus a, aliquam aliquet ex.",
  },
];

export const MainContentSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full max-w-[1112px] mx-auto items-center justify-center gap-12 px-4">
      {contentSections.map((section) => (
        <div key={section.title} className={`w-full`}>
          <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal] mb-[45px]">
            {section.title}
          </h2>
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] whitespace-pre-line">
            {section.content}
          </p>
        </div>
      ))}

  <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[971px] mx-auto">
          {participantTypes.map((type) => (
            <div key={type.title} className="flex flex-col items-center">
              <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal] mb-[53px]">
                {type.title}
              </h3>
              <img
                className="w-full max-w-[451px] h-auto aspect-[451/403] object-cover mb-6"
                alt={type.title}
                src={type.image}
              />
              <p className="text-center [font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] max-w-[411px]">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>

  <div className="w-full">
        <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal] mb-[45px]">
          Como participar?
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus
          tincidunt pharetra. Morbi nec venenatis tortor, sit amet egestas nisi.
          Morbi consequat justo augue, at vestibulum purus condimentum id. Duis
          felis magna, placerat vel lacus a, aliquam aliquet ex. Etiam id lectus
          justo. Donec pellentesque ipsum a nisl dapibus, non hendrerit enim
          gravida. Maecenas vel est ac risus viverra sagittis vitae vitae nulla.
          Vivamus et interdum ex. Fusce porttitor odio ut ornare consequat.
          Etiam tempus elementum urna non vulputate. Sed ullamcorper sapien
          ultricies accumsan scelerisque. Donec placerat tellus id pharetra
          tempus.
          <br />
          Integer et finibus enim. Pellentesque id odio sed ipsum bibendum
          luctus ut eget nibh. Pellentesque habitant morbi tristique senectus et
          netus et malesuada fames ac turpis egestas. Maecenas risus mauris,
          hendrerit eget ligula ut, egestas porttitor neque. Vestibulum in nisl
          ex.
        </p>
      </div>

  <Card className="w-full bg-cinza rounded-[30px] border border-solid border-[#d5d7d4]">
        <CardContent className="p-[60px]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 flex-1 lg:pr-[60px]">
              <h3 className="font-t-tulos font-[number:var(--t-tulos-font-weight)] text-verde-escuro text-[length:var(--t-tulos-font-size)] tracking-[var(--t-tulos-letter-spacing)] leading-[var(--t-tulos-line-height)] [font-style:var(--t-tulos-font-style)]">
                Faça parte do Agriconnect
              </h3>
              <p className="[font-family:'Inter',Helvetica] font-normal text-texto text-lg tracking-[0] leading-[normal]">
                Solicite o cadastro da sua associação no Agriconnect. É simples,
                rápido e prático. Conecte seus produtores e seus produtos ao
                maior ecommerce da agricultura amazonense e transforme suas
                realidades.
              </p>
            </div>
            <Button
              className="h-auto bg-fundo-claro rounded-2xl border border-solid border-[#9cb217] px-6 py-2.5 hover:bg-fundo-claro/90 transition-colors"
              variant="outline"
            >
              <span className="font-[number:var(--bot-es-font-weight)] text-verde-claro text-center leading-[var(--bot-es-line-height)] font-bot-es text-[length:var(--bot-es-font-size)] tracking-[var(--bot-es-letter-spacing)] [font-style:var(--bot-es-font-style)] mr-2">
                Cadastrar associação
              </span>
              <img
                className="w-6 h-6"
                alt="User add"
                src="https://c.animaapp.com/mfh1vpp1e8a9vm/img/user-add.svg"
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
