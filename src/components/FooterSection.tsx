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
    <footer className="w-full bg-cinza py-8 md:py-10 lg:py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 items-start">
          {/* Logo Section */}
          <div className="flex flex-col items-center sm:items-start gap-2 sm:col-span-2 lg:col-span-1">
            <img
              className="w-16 h-16 md:w-[80px] md:h-[87px] object-cover"
              alt="Logo Agriconnect"
              src="https://c.animaapp.com/mfyaim5kgxckXx/img/ativo-1-2-1.png"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/80x87/1d4510/ffffff?text=Logo";
              }}
            />
            <div className="[font-family:'Inter',Helvetica] font-bold text-verde-escuro text-base md:text-lg tracking-[0] leading-[normal]">
              Agriconnect
            </div>
            <p className="text-texto text-xs md:text-sm text-center sm:text-left mt-2 max-w-[200px]">
              Conectando agricultores e consumidores
            </p>
          </div>

          {/* Navigation Sections */}
          {sections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-2 md:gap-3"
            >
              <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-base md:text-lg tracking-[0] leading-[normal] mb-1">
                {section.title}
              </h3>
              <div className="flex flex-col gap-1 md:gap-1.5">
                {section.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="inline-flex min-h-[32px] md:min-h-[28px] items-center gap-2.5 px-0 py-1"
                  >
                    <Link 
                      to={link.href}
                      className="font-normal text-texto text-sm md:text-base leading-[normal] [font-family:'Montserrat',Helvetica] tracking-[0] hover:text-verde-escuro transition-colors touch-manipulation"
                    >
                      {link.text}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Social Media Section */}
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-base md:text-lg tracking-[0] leading-[normal] mb-1">
              Redes Sociais
            </h3>
            <div className="flex flex-col gap-2 md:gap-2.5">
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Agriconnect"
                className="inline-flex items-center gap-2 md:gap-3 text-texto hover:text-verde-escuro transition-colors min-h-[44px] md:min-h-[32px] touch-manipulation"
              >
                <img 
                  src="/img/ic_baseline-facebook.svg" 
                  alt="Facebook" 
                  className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0"
                />
                <span className="[font-family:'Montserrat',Helvetica] text-sm md:text-base">Facebook</span>
              </a>

              <a
                href="https://instagram.com/agriconnect"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Agriconnect"
                className="inline-flex items-center gap-2 md:gap-3 text-texto hover:text-verde-escuro transition-colors min-h-[44px] md:min-h-[32px] touch-manipulation"
              >
                <img 
                  src="img/lets-icons_insta.svg" 
                  alt="Instagram" 
                  className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0"
                />
                <span className="[font-family:'Montserrat',Helvetica] text-sm md:text-base">Instagram</span>
              </a>

              <a
                href="https://linkedin.com/company/agriconnect"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Agriconnect"
                className="inline-flex items-center gap-2 md:gap-3 text-texto hover:text-verde-escuro transition-colors min-h-[44px] md:min-h-[32px] touch-manipulation"
              >
                <img 
                  src="img/mdi_linkedin.svg" 
                  alt="LinkedIn" 
                  className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0"
                />
                <span className="[font-family:'Montserrat',Helvetica] text-sm md:text-base">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 md:mt-10 lg:mt-12 pt-6 md:pt-8 border-t border-gray-300">
          <div className="[font-family:'Inter',Helvetica] font-normal text-texto text-xs md:text-sm tracking-[0] leading-[normal]">
            Copyright © 2025 - Agriconnect
          </div>
        </div>
      </div>
    </footer>
  );
};