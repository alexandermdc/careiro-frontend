import {
  ChevronRightIcon,
  MessageCircleIcon,
  Building2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import associacaoService from "../../../services/associacaoService";
import type { Associacao } from "../../../services/associacaoService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../components/bradcrumb";
import { Button } from "../../../components/button";
import { JoinAgriconnectBanner } from "../../../components/JoinAgriconnectBanner";

export const MainContentSection = (): React.ReactElement => {
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarAssociacoes();
  }, []);

  const carregarAssociacoes = async () => {
    try {
      setLoading(true);
      const data = await associacaoService.getAll();
      setAssociacoes(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar associações');
    } finally {
      setLoading(false);
    }
  };

  // Função para processar URLs de imagem
  const getImageSrc = (image: string | null | undefined): string | null => {
    if (!image) return null;
    if (image.startsWith('data:image') || image.startsWith('data:')) return image;
    if (image.startsWith('/9j/') || image.startsWith('iVBOR') || image.length > 100) {
      const mimeType = image.startsWith('iVBOR') ? 'png' : 'jpeg';
      return `data:image/${mimeType};base64,${image}`;
    }
    return image;
  };

  // Pegando a primeira associação do banco
  const associacaoAtual = associacoes.length > 0 ? associacoes[0] : null;

  if (loading) {
    return (
      <main className="flex flex-col w-full max-w-[1112px] mx-auto items-center justify-center gap-11 px-4 py-8 min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro"></div>
          <p className="text-texto">Carregando associações...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col w-full max-w-[1112px] mx-auto items-center justify-center gap-11 px-4 py-8 min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={carregarAssociacoes}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </main>
    );
  }

  if (!associacaoAtual) {
    return (
      <main className="flex flex-col w-full max-w-[1112px] mx-auto items-center justify-center gap-11 px-4 py-8 min-h-[400px]">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma associação encontrada
          </h3>
        </div>
      </main>
    );
  }

  // Vendedores da associação
  const vendedores = associacaoAtual?.vendedor || [];

  // Produtos não disponíveis no schema atual

  return (
    <main className="flex flex-col w-full max-w-[1112px] mx-auto items-start gap-11 px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-sm font-normal text-texto [font-family:'Montserrat',Helvetica]"
              >
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon className="w-2 h-2" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-sm font-normal text-texto [font-family:'Montserrat',Helvetica]"
              >
                Associação
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <img
                className="w-[2.75px] h-[5.83px]"
                alt="Vector"
                src="https://c.animaapp.com/mfyaim5kgxckXx/img/vector.svg"
              />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-sm font-normal text-texto [font-family:'Montserrat',Helvetica]">
                Text
              </span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Association Profile Section */}
      <section className="relative w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          {getImageSrc(associacaoAtual.image) ? (
            <img
              className="w-full lg:w-[357px] h-[357px] object-cover rounded-lg"
              alt={associacaoAtual.nome}
              src={getImageSrc(associacaoAtual.image)!}
            />
          ) : (
            <div className="w-full lg:w-[357px] h-[357px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-lg">
              <Building2 className="w-32 h-32 text-verde-escuro opacity-50" />
            </div>
          )}

          <div className="flex flex-col gap-6 flex-1">
            <h1 className="[font-family:'Inter',Helvetica] font-bold text-texto text-2xl">
              {associacaoAtual.nome}
            </h1>

            <Button
              variant="outline"
              className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl"
            >
              <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                Chat
              </span>
              <MessageCircleIcon className="w-6 h-6 ml-2" />
            </Button>

            {associacaoAtual.descricao && (
              <div className="flex flex-col gap-2">
                <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-base">
                  Descrição
                </h2>
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-sm leading-normal">
                  {associacaoAtual.descricao}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Associated Producers Section */}
      <section className="flex flex-col w-full max-w-[467px] items-start gap-2 ">
        <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl">
          Vendedores associados
        </h2>
        <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base">
          {vendedores.length} vendedor(es) cadastrado(s)
        </p>
      </section>

      {/* Producers Grid */}
      {vendedores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full ">
          {vendedores.map((vendedor) => (
            <div
              key={`vendedor-${vendedor.id_vendedor}`}
              className="flex flex-col items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="w-full h-[200px] bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold text-verde-escuro">
                  {vendedor.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-lg text-center">
                {vendedor.nome}
              </h3>
              <p className="text-sm text-gray-600">{vendedor.telefone}</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {vendedor.tipo_vendedor}
                </span>
                {vendedor.tipo_documento && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {vendedor.tipo_documento}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center w-full py-8 text-gray-500">
          Nenhum vendedor cadastrado nesta associação
        </div>
      )}

      {/* Call to Action Banner */}
      <JoinAgriconnectBanner />
    </main>
  );
};
