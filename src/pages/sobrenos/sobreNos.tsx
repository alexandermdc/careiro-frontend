import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { AboutSectionSobreNos } from "./sections/AboutSobrenos";
import { MainContentSection } from "./sections/MainSections";

export const SobreNos = (): React.ReactElement => {
  // Seções do footer iguais às da associação
  const sobreNosFooterSections = [
    {
      title: "O Agriconnect",
      links: [
        { text: "O que é", href: "#" },
        { text: "Quem faz parte", href: "#" },
        { text: "Como participar", href: "#" },
      ],
    },
    {
      title: "Produtos",
      links: [
        { text: "Verduras", href: "#" },
        { text: "Legumes", href: "#" },
        { text: "Frutas", href: "#" },
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
    <PageLayout footerSections={sobreNosFooterSections}>
      <div className="bg-fundo-claro w-full flex flex-col relative">
        <AboutSectionSobreNos />
        <MainContentSection />
      </div>
    </PageLayout>
  );
};
