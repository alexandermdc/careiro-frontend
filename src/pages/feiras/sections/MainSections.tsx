import {
  Calendar1Icon,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../../../components/button";
import { JoinAgriconnectBanner } from "../../../components/JoinAgriconnectBanner";
import feiraService from "../../../services/feiraService";
import type { Feira } from "../../../services/feiraService";
import { Card, CardContent } from "../../../components/cards";
import Modal from "../../../components/Modal";

export const MainContentSection = (): React.ReactElement => {
  const [feiras, setFeiras] = useState<Feira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [feiraSelecionada, setFeiraSelecionada] = useState<Feira | null>(null);

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

  const abrirModal = (feira: Feira) => {
    setFeiraSelecionada(feira);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setFeiraSelecionada(null);
  };

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

  return (
    <main className="flex flex-col w-full max-w-[1112px] mx-auto items-start gap-11 px-4 py-8">
      {/* Header */}
      <header>
        <h1 className="w-full [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl mb-2">
          Nossas Feiras
        </h1>
        <p className="text-gray-600">Conheça as feiras da região</p>
      </header>

      {/* Grid de Feiras */}
      {feiras.length === 0 ? (
        <div className="w-full text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma feira encontrada
          </h3>
          <p className="text-gray-600">
            Ainda não há feiras cadastradas no sistema.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {feiras.map((feira) => (
            <Card
              key={feira.id_feira}
              className="w-full h-fit flex flex-col items-center gap-6 pt-0 pb-6 px-0 bg-fundo-claro rounded-[30px] overflow-hidden border border-solid border-[#b5b5b5] shadow-[0px_0px_4px_#00000040] transition-transform hover:scale-[1.02] duration-300"
            >
              <CardContent className="p-0 w-full">
                {getImageSrc(feira.image) ? (
                  <img
                    className="w-full h-[333px] object-cover"
                    alt={`${feira.nome} image`}
                    src={getImageSrc(feira.image)!}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-[333px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center';
                        fallback.innerHTML = '<svg class="w-24 h-24 text-verde-escuro opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                        parent.insertBefore(fallback, parent.firstChild);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-[333px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Calendar className="w-24 h-24 text-verde-escuro opacity-50" />
                  </div>
                )}

                <div className="flex flex-col items-center px-6 pt-6 pb-3 gap-4">
                  <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-base text-center tracking-[0] leading-[normal]">
                    {feira.nome}
                  </h3>

                  {feira.data_hora && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar1Icon className="w-4 h-4 text-verde-escuro" />
                      <span className="text-sm">{feira.data_hora}</span>
                    </div>
                  )}

                  {feira.descricao && (
                    <p className="text-sm text-gray-600 text-center line-clamp-2">
                      {feira.descricao}
                    </p>
                  )}
                </div>

                <div className="flex justify-center px-6 pb-4">
                  <Button
                    variant="outline"
                    onClick={() => abrirModal(feira)}
                    className="w-[248.5px] h-12 bg-fundo-claro rounded-2xl border border-solid border-[#9cb217] hover:bg-verde-claro hover:text-fundo-claro transition-colors duration-300"
                  >
                    <span className="font-[number:var(--bot-es-font-weight)] text-verde-claro text-[length:var(--bot-es-font-size)] leading-[var(--bot-es-line-height)] font-bot-es tracking-[var(--bot-es-letter-spacing)] [font-style:var(--bot-es-font-style)] group-hover:text-fundo-claro">
                      Ver mais
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Banner */}
      <div className="mt-16 w-full">
        <JoinAgriconnectBanner />

      {/* Modal de Detalhes */}
      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title="Detalhes da Feira"
        showFooter={false}
      >
        {feiraSelecionada && (
          <div className="flex flex-col gap-6">
            {/* Imagem */}
            {getImageSrc(feiraSelecionada.image) ? (
              <img
                className="w-full h-[300px] object-cover rounded-lg"
                alt={`${feiraSelecionada.nome} imagem`}
                src={getImageSrc(feiraSelecionada.image)!}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-[300px] bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-24 h-24 text-verde-escuro opacity-50" />
              </div>
            )}

            {/* Nome */}
            <div>
              <h3 className="text-2xl font-bold text-verde-escuro mb-2">
                {feiraSelecionada.nome}
              </h3>
            </div>

            {/* Data e Hora */}
            {feiraSelecionada.data_hora && (
              <div className="flex items-start gap-3">
                <Calendar1Icon className="w-5 h-5 text-verde-escuro mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700">Data e Horário</p>
                  <p className="text-gray-600">{feiraSelecionada.data_hora}</p>
                </div>
              </div>
            )}

            {/* Localização */}
            {feiraSelecionada.localizacao && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-verde-escuro mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700">Localização</p>
                  <p className="text-gray-600">{feiraSelecionada.localizacao}</p>
                </div>
              </div>
            )}

            {/* Descrição */}
            {feiraSelecionada.descricao && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-verde-escuro mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700">Sobre a Feira</p>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {feiraSelecionada.descricao}
                  </p>
                </div>
              </div>
            )}


          </div>
        )}
      </Modal>
      </div>
    </main>
  );
};
