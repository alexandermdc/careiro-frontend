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
  <footer className="w-full bg-cinza relative">
      <div className="max-w-[1440px] mx-auto px-4 py-16 relative">
        {/* Logo and Brand Section */}
  <div className="flex flex-col items-start gap-2">
          <img
            className="w-[107px] h-[117px] object-cover"
            alt="Ativo"
            src="https://c.animaapp.com/mfh1vpp1e8a9vm/img/ativo-1-2-1.png"
          />
          <div className="[font-family:'Inter',Helvetica] font-bold text-verde-escuro text-[19px] tracking-[0] leading-[normal]">
            Agriconnect
          </div>
        </div>

        {/* Navigation Links Section */}
  <div className="flex items-start gap-[53px] mt-8">
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {footerSections.map((section, index) => (
            <div
              key={section.title}
              className="flex flex-col w-[170px] items-start gap-2"
            >
              <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal]">
                {section.title}
              </h3>
              <nav className="flex flex-col gap-3">
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="font-normal text-texto [font-family:'Montserrat',Helvetica] text-base tracking-[0] leading-[normal] hover:text-verde-escuro transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Social Media Section */}
  <div className="flex flex-col items-start gap-4 mt-8">
          <div className="[font-family:'Inter',Helvetica] font-normal text-texto text-lg tracking-[0] leading-[normal]">
            Acesse nossas redes!
          </div>
          <img
            className="w-40 h-12"
            alt="Frame"
            src="https://c.animaapp.com/mfh1vpp1e8a9vm/img/frame-13.svg"
          />
        </div>

        {/* Copyright Section */}
  <div className="text-center mt-12">
          <div className="[font-family:'Inter',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal]">
            Copyright © 2025 - Agriconnect
          </div>
        </div>
      </div>
    </footer>
  );
};
