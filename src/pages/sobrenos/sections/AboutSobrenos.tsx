import { type JSX } from "react";
import { Button } from "../../../components/button";
import { Card, CardContent } from "../../../components/cards";
import agriculturaFamiliar from "../../../assets/img/20230803_agriculturafamiliar.jpg";

export const AboutSectionSobreNos = (): JSX.Element => {
  return (
    <section className="w-full bg-gradient-to-br from-verde-claro/10 to-verde-escuro/5 py-20">
      <div className="flex items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl w-full">
          <div className="flex-1 text-center lg:text-left">
              <img
                src={agriculturaFamiliar}
                alt="Agricultores conectando com consumidores"
                className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl"
                style={{ minHeight: "420px", minWidth: "360px" }}
              />
          </div>

          <div className="flex-1 max-w-lg">
            <Card className="bg-white border-0 shadow-2xl">
              <CardContent className="p-10 text-center">
                <h2 className="[font-family:'Montserrat',Helvetica] font-semibold text-verde-escuro text-3xl lg:text-4xl leading-tight mb-10">
                  Conectando os melhores agricultores até você
                </h2>

                <Button 
                  className="bg-verde-escuro hover:bg-verde-escuro/90 text-white [font-family:'Montserrat',Helvetica] font-bold text-xl lg:text-2xl px-12 py-6 h-auto transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => {
                    // Adicionar lógica de navegação aqui
                    console.log('Navegando para a loja...');
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
  );
};
