import React from "react";
import { AboutSectionSobreNos } from "./sections/AboutSobrenos";
import { FooterSection } from "./sections/FooterSections";
import { HeaderSection } from "./sections/HeaderSections";
import { MainContentSection } from "./sections/MainSections";

export const SobreNos = (): React.ReactElement => {
  return (
    <div
      className="bg-[#fafcf9] min-h-screen w-full flex flex-col"
      data-model-id="347:2352"
    >
      <div className="bg-fundo-claro w-full flex flex-col relative">
        <div>
          <HeaderSection />
        </div>
        <div>
          <AboutSectionSobreNos />
        </div>
        <div>
          <MainContentSection />
        </div>
        <div>
          <FooterSection />
        </div>
      </div>
    </div>
  );
};
