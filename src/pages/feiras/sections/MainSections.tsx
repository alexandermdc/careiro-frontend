import {
  Calendar1Icon,
  ChevronRightIcon,
  Calendar,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../components/bradcrumb";
import { Button } from "../../../components/button";
import { JoinAgriconnectBanner } from "../../../components/JoinAgriconnectBanner";
import feiraService from "../../../services/feiraService";
import type { Feira } from "../../../services/feiraService";

export const MainContentSection = (): React.ReactElement => {
  const [feiras, setFeiras] = useState<Feira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarFeiras();
  }, []);

  const carregarFeiras = async () => {
    try {
      setLoading(true);
      const data = await feiraService.listarTodas();
      setFeiras(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar feiras');
    } finally {
      setLoading(false);
    }
  };

  const producers = [
    {
      image: "img/AssociaMamori.png",
      name: "Associaçao Amuri",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/ellipse-6-1.png",
      name: "Maria Núbia",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/ellipse-6-2.png",
      name: "Adriano Garra",
    },
    {
      image: "https://c.animaapp.com/mfyaim5kgxckXx/img/ellipse-6-3.png",
      name: "Fernando Santos",
    },
  ];

  if (loading) {
    return (
      <main className="flex flex-col w-full max-w-[1112px] mx-auto items-center justify-center gap-11 px-4 py-8 min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro"></div>
          <p className="text-texto">Carregando feiras...</p>
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
            onClick={carregarFeiras}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </main>
    );
  }

  // Pegando a primeira feira do banco para exibir (ou você pode fazer um sistema de seleção)
  const feiraAtual = feiras.length > 0 ? feiras[0] : null;

  // Função para processar URLs de imagem e usar proxy quando necessário
  const getImageSrc = (image: string | null | undefined): string | null => {
    if (!image) return null;
    
    // Se já for base64, retorna como está
    if (image.startsWith('data:image') || image.startsWith('data:')) return image;
    
    // Se for URL do Supabase, usar proxy para evitar CORS
    if (image.includes('supabase.co/storage')) {
      return `http://localhost:3000/image-proxy?url=${encodeURIComponent(image)}`;
    }
    
    // Se for HTTP/HTTPS (outras URLs), usar proxy também por segurança
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return `http://localhost:3000/image-proxy?url=${encodeURIComponent(image)}`;
    }
    
    // Se começar com /, é caminho local
    if (image.startsWith('/')) return image;
    
    // Se parece ser base64 sem prefixo
    if (image.startsWith('/9j/') || image.startsWith('iVBOR') || image.length > 100) {
      const mimeType = image.startsWith('iVBOR') ? 'png' : 'jpeg';
      return `data:image/${mimeType};base64,${image}`;
    }
    
    return image;
  };

  return (
    <main className="flex flex-col w-full max-w-[1112px] mx-auto items-start gap-11 px-4 py-8">
      {/* Header com Título e Botões de Cadastro */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nossas Feiras</h1>
          <p className="text-gray-600 mt-1">Conheça as feiras da região</p>
        </div>
      </div>

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
        {feiraAtual ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
            {(() => {
              const imageSrc = getImageSrc(feiraAtual.image);
              console.log('🖼️ Feira imagem original:', feiraAtual.image);
              console.log('🖼️ Feira imagem processada:', imageSrc);
              
              if (!imageSrc) {
                return (
                  <div className="w-full lg:w-[357px] h-[357px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-lg">
                    <Calendar className="w-32 h-32 text-verde-escuro opacity-50" />
                  </div>
                );
              }
              
              return (
                <img
                  className="w-full lg:w-[357px] h-[357px] object-cover rounded-lg"
                  alt={feiraAtual.nome}
                  src={imageSrc}
                  onError={(e) => {
                    console.error('❌ Erro ao carregar imagem da feira');
                    console.error('   URL original:', feiraAtual.image);
                    console.error('   URL processada:', imageSrc);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="w-full lg:w-[357px] h-[357px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-lg">
                        <svg class="w-32 h-32 text-verde-escuro opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    `;
                  }}
                />
              );
            })()}

            <div className="flex flex-col justify-center gap-6 flex-1">
              <h1 className="[font-family:'Inter',Helvetica] font-bold text-texto text-2xl">
                {feiraAtual.nome}
              </h1>
              {feiraAtual.data_hora && (
                <h2 className="[font-family:'montserrat'] text-texto text-lg">
                  {feiraAtual.data_hora}
                </h2>
              )}
              <Button
                variant="outline"
                className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl"
              >
                <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                  Marcar ao calendário
                </span>
                <Calendar1Icon className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma feira encontrada
            </h3>
            <p className="text-gray-600">
              Ainda não há feiras cadastradas no sistema.
            </p>
          </div>
        )}
      </section>

      {/* Subscriptions Section */}
      {feiraAtual && feiraAtual.descricao && (
        <section className="flex flex-col w-full items-start gap-4">
          <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl">
            Conheça mais a {feiraAtual.nome}
          </h2>
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-texto text-base leading-relaxed max-w-4xl">
            {feiraAtual.descricao}
          </p>
        </section>
      )}
      {/* Associated Producers Section */}
      <section className="flex flex-col w-full max-w-[467px] items-start gap-2 ">
        <h2 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl">
          Confira quem estará presente
        </h2>
      </section>

      {/* Producers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full ">
        {producers.map((producer, index) => (
          <div
            key={`producer-${index}`}
            className="flex flex-col items-center gap-4"
          >
            <img
              className="w-full h-[263px] object-cover rounded-full"
              alt="Ellipse"
              src={producer.image}
            />
            <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-2xl text-center">
              {producer.name}
            </h3>
          </div>
        ))}
      </div>
      {/* Call to Action Banner */}
      <JoinAgriconnectBanner />
    </main>
  );
};
