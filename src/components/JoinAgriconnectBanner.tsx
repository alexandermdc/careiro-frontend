import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./cards";

interface JoinAgriconnectBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const JoinAgriconnectBanner = ({
  title = "Faça parte do Agriconnect",
  description = "Solicite o cadastro da sua associação no Agriconnect. É simples, rápido e prático. Conecte seus produtores e seus produtos ao maior ecommerce da agricultura amazonense e transforme suas realidades.",
  buttonText = "Cadastrar associação",
  onButtonClick,
  className = "",
}: JoinAgriconnectBannerProps): React.ReactElement => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      // Redireciona para a página de cadastro de associação
      navigate('/associacao');
    }
  };

  return (
    <Card className={`w-full h-60 bg-[#eff3ef] rounded-[30px] border-[#d5d7d4] overflow-hidden ${className}`}>
      <CardContent className="flex flex-col lg:flex-row items-center justify-between h-full p-8 lg:px-[61px]">
        <div className="flex flex-col gap-2 max-w-[600px]">
          <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-[#1b5915] text-2xl">
            {title}
          </h2>
          <p className="[font-family:'Inter',Helvetica] font-normal text-texto text-lg">
            {description}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleClick}
          className="h-14 bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl flex-shrink-0 mt-4 lg:mt-0"
        >
          <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
            {buttonText}
          </span>
          <UserPlusIcon className="w-6 h-6 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};