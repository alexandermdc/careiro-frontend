import {type JSX} from "react";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSections/HeaderSection";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";

export const Homepage = (): JSX.Element => {
  return (
    <main
      className="bg-[#fafcf9] min-h-screen w-full flex flex-col"
      data-model-id="331:259"
    >
      <div className="bg-fundo-claro w-full flex flex-col">
        <HeaderSection />
        <img
          className="w-full h-[630px] object-cover"
          alt="Group"
          src="https://c.animaapp.com/meda5qjaouVHG5/img/group-127.png"
        />
        <MainContentSection />
        <FooterSection />
      </div>
    </main>
  );
};