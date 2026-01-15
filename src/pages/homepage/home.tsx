import React from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../components/PageLayout";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import HeroCTA from "../../components/HeroCTA";

export const Homepage = (): React.ReactElement => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="bg-fundo-claro w-full flex flex-col items-center">
        {/* Hero Section */}
        <HeroCTA
          imageSrc="/img/20230803_agriculturafamiliar.jpg"
          imageAlt="Agricultores conectando com consumidores"
          caption="Produção agrícola em área cultivada, com colheita manual de hortaliças, destacando o trabalho no campo, a organização do plantio e a importância da agricultura sustentável na produção de alimentos."
          title={"Conectando os melhores agricultores até você"}
          buttonText={"COMPRE AGORA"}
          onClick={() => navigate("/produtos")}
          imageStyle={{ minHeight: 250, maxHeight: 500 }}
        />

        {/* Main Content */}
        <MainContentSection />
      </div>
    </PageLayout>
  );
};
