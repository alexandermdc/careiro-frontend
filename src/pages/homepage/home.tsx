import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import { Card, CardContent } from "../../components/cards";
import { Button } from "../../components/button";

export const Homepage = (): React.ReactElement => {
  return (
    <PageLayout>
      <div className="bg-fundo-claro w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-verde-claro/10 to-verde-escuro/5 py-8 md:py-12 lg:py-20">
          <div className="flex items-center justify-center px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 max-w-6xl w-full">
              {/* Imagem */}
              <div className="flex-1 w-full">
                <img
                  src="/img/20230803_agriculturafamiliar.jpg"
                  alt="Agricultores conectando com consumidores"
                  className="w-full max-w-3xl mx-auto rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl object-cover"
                  style={{ 
                    minHeight: "250px",
                    maxHeight: "500px",
                    height: "auto"
                  }}
                />
              </div>

              {/* Card CTA */}
              <div className="flex-1 max-w-lg w-full">
                <Card className="bg-white border-0 shadow-lg md:shadow-2xl">
                  <CardContent className="p-6 md:p-8 lg:p-10 text-center">
                    <h2 className="[font-family:'Montserrat',Helvetica] font-semibold text-verde-escuro text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-6 md:mb-8 lg:mb-10">
                      Conectando os melhores agricultores até você
                    </h2>

                    <Button
                      className="bg-verde-escuro hover:bg-verde-escuro/90 text-white [font-family:'Montserrat',Helvetica] font-bold text-base sm:text-lg md:text-xl lg:text-2xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 h-auto transition-all duration-300 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                      onClick={() => {
                      }}
                    >
                      COMPRE AGORA
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <MainContentSection />
      </div>
    </PageLayout>
  );
};
