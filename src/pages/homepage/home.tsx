import {type JSX}from "react";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSections/HeaderSection";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";

export const Homepage = (): JSX.Element => {
  return (
    <main
      className="bg-[#fafcf9] min-h-screen w-full flex flex-col"
      data-model-id="331:259"
    >
      <div className="bg-fundo-claro w-full flex flex-col items-center">
        <HeaderSection />
        <img
          className="w-full max-w-[1440px] h-[630px] object-cover"
          alt="Banner Principal"
          src="https://c.animaapp.com/meda5qjaouVHG5/img/group-127.png"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/1200x630/9cb217/ffffff?text=Banner+Agriconnect";
          }}
        />
        <MainContentSection />
        <FooterSection />
      </div>
    </main>
  );
};
