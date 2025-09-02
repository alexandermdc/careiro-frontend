import {type JSX} from "react";

export const FooterSection = (): JSX.Element => {
  const footerSections = [
    {
      title: "O Agriconnect",
      links: [
        { text: "O que é", href: "#" },
        { text: "Quem faz parte", href: "#" },
        { text: "Como participar", href: "#" },
      ],
    },
    {
      title: "Associações",
      links: [
        { text: "Feiras", href: "#" },
        { text: "Produtores", href: "#" },
        { text: "Cidades", href: "#" },
      ],
    },
    {
      title: "Ajuda",
      links: [
        { text: "Dúvidas", href: "#" },
        { text: "Política de Privacidade", href: "#" },
        { text: "Termo de Uso", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-cinza py-[71px] px-[166px] relative">
      <div className="max-w-[1108px] mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start">
            <img
              className="w-[118px] h-[117px] mb-[7px]"
              alt="Logo Agriconnect"
              src="https://c.animaapp.com/meda5qjaouVHG5/img/captura-de-tela-2025-07-31-a-s-22-30-53-1-1.png"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/118x117/1d4510/ffffff?text=Logo";
              }}
            />
            <div className="[font-family:'Inter',Helvetica] font-bold text-verde-escuro text-[19px] tracking-[0] leading-[normal]">
              Agriconnect
            </div>
          </div>

          <div className="flex gap-[53px]">
            {footerSections.map((section, index) => (
              <div
                key={index}
                className="flex flex-col w-[170px] items-start gap-2"
              >
                <div className="[font-family:'Inter',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal] mb-2">
                  {section.title}
                </div>
                <div className="flex flex-col gap-3">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] hover:text-verde-escuro transition-colors"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start">
            <div className="[font-family:'Inter',Helvetica] font-normal text-texto text-lg tracking-[0] leading-[normal] mb-[12px]">
              Acesse nossas redes!
            </div>
            <img
              className="w-40 h-12"
              alt="Redes Sociais"
              src="https://c.animaapp.com/meda5qjaouVHG5/img/frame-13.svg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/160x48/9cb217/ffffff?text=Redes+Sociais";
              }}
            />
          </div>
        </div>

        <div className="text-center mt-[70px]">
          <div className="[font-family:'Inter',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal]">
            Copyright © 2025 - Agriconnect
          </div>
        </div>
      </div>
    </footer>
  );
};
