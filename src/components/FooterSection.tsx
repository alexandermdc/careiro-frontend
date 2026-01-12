import React from "react";
import { Link } from "react-router-dom";

export const FooterSection = (): React.ReactElement => {
  return (
    <footer className="w-full bg-cinza py-8 md:py-10 lg:py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Logo */}
            <div className="flex flex-col items-center sm:items-start gap-2 sm:col-span-3">
            <img
              className="w-32 h-32 md:w-[150px] md:h-[160px] object-cover"
              alt="Logo Agriconnect"
              src="/img/logo-agriconnect-vertical.png"
            />
            </div>

          {/* O Agriconnect links */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-base md:text-lg mb-2">O Agriconnect</h3>
            <nav className="flex flex-col gap-1">
              <Link to="/sobre" className="text-texto text-sm hover:text-verde-escuro">O que é</Link>
              <Link to="/participantes" className="text-texto text-sm hover:text-verde-escuro">Quem faz parte</Link>
              <Link to="/como-participar" className="text-texto text-sm hover:text-verde-escuro">Como participar</Link>
            </nav>
          </div>

          {/* Apoio */}
          <div className="flex flex-col gap-2 sm:col-span-5">
            <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-base md:text-lg mb-2">Apoio</h3>
            <p className="text-texto text-sm md:text-base max-w-3xl">
              Este projeto tem o apoio do <strong>Mover-se na Web</strong>, iniciativa do <a href="https://www.nic.br" target="_blank" rel="noopener noreferrer" className="text-verde-escuro underline"><strong>NIC.br</strong></a> e do <a href="https://ceweb.br" target="_blank" rel="noopener noreferrer" className="text-verde-escuro underline"><strong>Ceweb.br</strong></a> que promove o desenvolvimento da Web aberta por meio de soluções de impacto social. Saiba mais em: <a href="https://moverse.ceweb.br" target="_blank" rel="noopener noreferrer" className="text-verde-escuro underline">https://moverse.ceweb.br</a>
            </p>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center sm:items-end gap-2 sm:col-span-2">
            <h3 className="[font-family:'Inter',Helvetica] font-bold text-texto text-base md:text-lg mb-2">Acesse nossas redes!</h3>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/iesa.amazonia/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                <img src="/img/lets-icons_insta.svg" alt="Instagram" className="w-6 h-6" />
              </a>
              <a href="" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                <img src="/img/ic_baseline-facebook.svg" alt="Facebook" className="w-6 h-6" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                <img src="/img/mdi_linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
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