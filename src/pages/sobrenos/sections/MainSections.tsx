import {type JSX} from "react";
import { JoinAgriconnectBanner } from '../../../components/JoinAgriconnectBanner';

const contentSections = [
  {
    title: "O que é o projeto?",
    content:
      "A Rede de Produtores Agroecológicos do Careiro (REPAC) no Amazonas tem suas origens em 2015. Desde então, trabalha em prol das comunidades adjacentes, incentivando o fortalecimento dos conhecimentos de agroecologia e da economia local. Dessa forma, a fim de melhorar a comunicação dos produtores com os consumidores e fortalecer os laços dessa comunidade, nasceu o Agriconnect, plataforma com o intuito de gerar uma comercialização direta entre os produtores e consumidores, ajudando os produtores a gerenciarem seus produtos e vendas.\n\nO Agriconnect ressalta a importância de criar vínculos entre as associações produtoras e a comunidade geral, enaltecendo os produtos regionais e criando uma maior divulgação dos produtos e trabalho dos produtores.\n\nNa plataforma, é possível fazer compras de produtos e retirá-los em locais determinados, além das assinaturas disponíveis para a compra semanal e mensal de itens de ótima qualidade.\n\nNo Agriconnect, a tecnologia é aliada na criação de redes entre agricultores e clientes ao estabelecer um novo meio de compras e vendas dos produtos voltados para as feiras locais.",
  },
  {
    title: "Quem faz parte?",
    content:
      "Os produtores e associações participantes do Agriconnect estão envolvidos com o movimento agroecológico do Careiro de modo que toda sua produção adota os preceitos da agroecologia, visando oferecer produtos mais saudáveis e que fomentem o bem-viver alimentar no município.",
  },
];

const participantTypes = [
  {
    title: "Produtores",
    image: "/img/feirante.jpg",
    description:
      "Os produtores, dentro do Agriconnect, podem incluir dados sobre as suas produções e disponibilizar os produtos colhidos para serem vendidos, facilitando o processo de registro e acompanhamento da quantidade colhida, vendida e em estoque.",
  },
  {
    title: "Associações",
    image: "/img/pc_uniao.jpg",
    description:
      "A Associação de Produtores Orgânicos União e Força, fundada em 2022, é a principal associação vinculada ao Agriconnect. Os seus produtores, localizados na estrada de Autazes (km 14), comercializam produtos na Feira da Agricultura Familiar na sede do município de Careiro e na Feira Orgânica do Comercial PC, também na estrada de Autazes. Produzem e vendem, principalmente, hortaliças, frutas, farinhas e temperos.\n\nA Associação Unidos Venceremos da região do Mamori, Careiro, foi fundada em 2019 e está localizada na BR-319, Km 28, Ramal do Mamori. Atualmente conta com 18 produtores agroecológicos que trabalham no sistema orgânico. Produzem e vendem principalmente hortaliças, frutas e tubérculos.\n\nAssociação São José, localiza-se também na BR-319, no Km 68, Ramal do São José, possui mais de 10 anos de atuação. Atualmente, possui a Feira de Empreendedorismo Rural realizada todos os domingos no Km 11 do ramal onde são comercializados produtos regionais de produtores da região.\n\nNo Agriconnect, as associações podem visualizar dados sobre o desempenho da organização e resumos sobre o rendimento dos produtos, produtores e feiras. Na plataforma, é possível visualizar todos os âmbitos gerenciados por uma associação e adicionar os produtores afiliados, adicionando-os ao sistema de maneira vinculada à associação.",
  },
];

export const MainContentSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full max-w-[1112px] mx-auto items-center justify-center gap-12 px-4 py-8">
      {contentSections.map((section) => (
        <div key={section.title} className={`w-full`}>
          <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal] mb-[45px]">
            {section.title}
          </h2>
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] whitespace-pre-line text-justify">
            {section.content}
          </p>
        </div>
      ))}

  <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[971px] mx-auto">
          {participantTypes.map((type) => (
            <div key={type.title} className="flex flex-col items-center">
              <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal] mb-[53px]">
                {type.title}
              </h3>
              <img
                className="w-full max-w-[451px] h-auto aspect-[451/403] object-cover mb-6"
                alt={type.title}
                src={type.image}
              />
              <p className="text-justify [font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] max-w-[411px]">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl tracking-[0] leading-[normal] mb-[45px]">
          Como participar?
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base tracking-[0] leading-[normal] text-justify">
          A associação que deseja fazer parte do Agriconnect deve enviar uma 
          solicitação de cadastro para o e-mail do projeto. Após analisada e 
          aceita, a associação começa a fazer parte do projeto e começa a utilizar 
          os serviços da plataforma onde poderá divulgar e comercializar seus 
          produtos, além de possuir uma ferramenta para a gestão produtiva da 
          associação e dos produtores, individualmente.
        </p>
      </div>      {/* Espaçamento extra antes do banner */}
        <JoinAgriconnectBanner />
    </section>
  );
};
