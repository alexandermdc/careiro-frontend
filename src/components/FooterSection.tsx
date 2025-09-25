import React from "react";
import { Link } from "react-router-dom";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterSectionData {
  title: string;
  links: FooterLink[];
}

interface FooterSectionProps {
  sections?: FooterSectionData[];
}

const defaultSections: FooterSectionData[] = [
  {
    title: "O Agriconnect",
    links: [
      { text: "O que é", href: "/sobre" },
      { text: "Quem faz parte", href: "/participantes" },
      { text: "Como participar", href: "/como-participar" },
    ],
  },
  {
    title: "Produtos",
    links: [
      { text: "Verduras", href: "/produtos?categoria=verduras" },
      { text: "Legumes", href: "/produtos?categoria=legumes" },
      { text: "Frutas", href: "/produtos?categoria=frutas" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { text: "Dúvidas", href: "/ajuda" },
      { text: "Política de Privacidade", href: "/privacidade" },
      { text: "Termo de Uso", href: "/termos" },
    ],
  },
];

export const FooterSection = ({ sections = defaultSections }: FooterSectionProps): React.ReactElement => {
  return (
    <footer className="w-full bg-cinza py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Logo Section */}
          <div className="flex flex-col items-start gap-1">
            <img
              className="w-[80px] h-[87px] object-cover"
              alt="Logo Agriconnect"
              src="https://c.animaapp.com/mfyaim5kgxckXx/img/ativo-1-2-1.png"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/80x87/1d4510/ffffff?text=Logo";
              }}
            />
            <div className="[font-family:'Inter',Helvetica] font-bold text-verde-escuro text-base tracking-[0] leading-[normal]">
              Agriconnect
            </div>
          </div>

          {/* Navigation Sections */}
          {sections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-1"
            >
              <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-lg tracking-[0] leading-[normal] mb-1">
                {section.title}
              </h3>
              <div className="flex flex-col gap-0">
                {section.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="inline-flex h-6 items-center gap-2.5 px-0 py-0.5"
                  >
                    <Link 
                      to={link.href}
                      className="font-normal text-texto text-base leading-[normal] [font-family:'Montserrat',Helvetica] tracking-[0] hover:text-verde-escuro transition-colors"
                    >
                      {link.text}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Social Media Section */}
          <div className="flex flex-col gap-1">
            <div className="[font-family:'Inter',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal]">
              Acesse nossas redes!
            </div>
            <img
              className="w-32 h-10"
              alt="Redes Sociais"
              src="https://c.animaapp.com/mfyaim5kgxckXx/img/frame-13.svg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/128x40/1d4510/ffffff?text=Redes";
              }}
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <div className="[font-family:'Inter',Helvetica] font-normal text-texto text-sm tracking-[0] leading-[normal]">
            Copyright © 2025 - Agriconnect
          </div>
        </div>
      </div>
    </footer>
  );
};