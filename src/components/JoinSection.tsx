import React from 'react';
import { Button } from './button';
import { UserPlusIcon } from 'lucide-react';

export interface JoinSectionProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

export const JoinSection: React.FC<JoinSectionProps> = ({
  title = 'Faça parte do Agriconnect',
  description = 'Solicite o cadastro da sua associação no Agriconnect. É simples, rápido e prático. Conecte seus produtores e seus produtos ao maior ecommerce da agricultura amazonense e transforme suas realidades.',
  onClick,
}) => {
  return (
    <div className="w-full">
      <div className="w-full max-w-[1112px] mx-auto">
        <div className="flex items-center justify-between gap-6 bg-cinza rounded-[30px] p-[60px] border border-solid border-[#d5d7d4]">
          <div className="flex-1 pr-6">
            <h3 className="font-t-tulos text-verde-escuro text-[length:var(--t-tulos-font-size)] font-[number:var(--t-tulos-font-weight)]">
              {title}
            </h3>
            <p className="mt-4 text-texto max-w-[720px]">{description}</p>
          </div>

          <div className="flex-shrink-0">
            <Button
              onClick={onClick}
              variant="outline"
              className="h-14 inline-flex items-center justify-center gap-2 px-6 bg-fundo-claro rounded-2xl border border-solid border-[#9cb217]"
            >
              <span className="text-verde-claro font-bot-es">Cadastrar associação</span>
              <UserPlusIcon className="w-6 h-6 text-verde-escuro" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSection;
