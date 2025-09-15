import React from "react";

// Footer navigation data
const footerSections = [
  {
    title: "O Agriconnect",
    links: [
      { label: "O que é", href: "#" },
      { label: "Quem faz parte", href: "#" },
      { label: "Como participar", href: "#" },
    ],
  },
  {
    title: "Produtos",
    links: [
      { label: "Verduras", href: "#" },
      { label: "Legumes", href: "#" },
      { label: "Frutas", href: "#" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Dúvidas", href: "#" },
      { label: "Política de Privacidade", href: "#" },
      { label: "Termo de Uso", href: "#" },
    ],
  },
];

export const FooterSection = (): React.ReactElement => {
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
                      {link.label}
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
            Copyright \u00a9 2025 - Agriconnect
          </div>
        </div>
      </div>
    </footer>
  );
};
