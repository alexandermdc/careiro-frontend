import { type JSX } from "react";
import { useNavigate } from "react-router-dom";
import HeroCTA from '../../../components/HeroCTA';

export const AboutSectionSobreNos = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <HeroCTA
      imageSrc={'/img/20230803_agriculturafamiliar.jpg'}
      imageAlt={'Agricultores conectando com consumidores'}
      caption={'Produção agrícola em área cultivada, com colheita manual de hortaliças, destacando o trabalho no campo, a organização do plantio e a importância da agricultura sustentável na produção de alimentos.'}
      title={"Conectando os melhores agricultores até você"}
      buttonText={"COMPRE AGORA"}
      onClick={() => navigate('/produtos')}
      imageStyle={{ minHeight: 250, maxHeight: 500 }}
      containerClassName="py-20"
    />
  );
};
