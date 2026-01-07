import React, { useState, useEffect } from "react";
import { Button } from "../../../components/button";
import { Card, CardContent } from "../../../components/cards";
import { JoinAgriconnectBanner } from '../../../components/JoinAgriconnectBanner';
import Modal from '../../../components/Modal';
import associacaoService from '../../../services/associacaoService';
import type { Associacao } from '../../../services/associacaoService';
import { Building2, MapPin, Clock, Users, Info } from 'lucide-react';

export const MainContentSection = (): React.ReactElement => {
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssociacao, setSelectedAssociacao] = useState<Associacao | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleVerMais = (associacao: Associacao) => {
    setSelectedAssociacao(associacao);
    setShowModal(true);
  };

  if (loading) {
    return (
      <section className="flex flex-col w-full items-center justify-center gap-11 relative py-8 px-4 max-w-[1112px] mx-auto min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro"></div>
          <p className="text-texto">Carregando associações...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col w-full items-center justify-center gap-11 relative py-8 px-4 max-w-[1112px] mx-auto min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={carregarAssociacoes}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full items-start gap-11 relative py-8 px-4 max-w-[1112px] mx-auto">
      <header>
        <h1 className="w-full [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl mb-6">
          Associações
        </h1>
      </header>

      {associacoes.length === 0 ? (
        <div className="w-full text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma associação encontrada
          </h3>
          <p className="text-gray-600">
            Ainda não há associações cadastradas no sistema.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {associacoes.map((associacao) => (
            <Card
              key={associacao.id_associacao}
              className="w-full h-fit flex flex-col items-center gap-6 pt-0 pb-6 px-0 bg-fundo-claro rounded-[30px] overflow-hidden border border-solid border-[#b5b5b5] shadow-[0px_0px_4px_#00000040] transition-transform hover:scale-[1.02] duration-300"
            >
              <CardContent className="p-0 w-full">
                {associacao.image ? (
                  <img
                    className="w-full h-[333px] object-cover"
                    alt={`${associacao.nome} image`}
                    src={associacao.image}
                  />
                ) : (
                  <div className="w-full h-[333px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Building2 className="w-24 h-24 text-verde-escuro opacity-50" />
                  </div>
                )}

                <div className="flex items-center justify-center px-6 pt-6 pb-3">
                  <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-texto text-base text-center tracking-[0] leading-[normal]">
                    {associacao.nome}
                  </h3>
                </div>

                <div className="flex justify-center px-6 pb-4">
                  <Button
                    variant="outline"
                    onClick={() => handleVerMais(associacao)}
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

      {/* Espaçamento antes do banner */}
      <div className="mt-16 w-full">
        <JoinAgriconnectBanner />
      </div>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAssociacao?.nome || ''}
        maxWidth="2xl"
        showFooter={false}
      >
        {selectedAssociacao && (
          <div className="space-y-6">
            {/* Imagem */}
            {selectedAssociacao.image ? (
              <img
                className="w-full h-[400px] object-cover rounded-lg"
                alt={`${selectedAssociacao.nome} image`}
                src={selectedAssociacao.image}
              />
            ) : (
              <div className="w-full h-[400px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-lg">
                <Building2 className="w-32 h-32 text-verde-escuro opacity-50" />
              </div>
            )}

            {/* Informações Gerais */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-verde-escuro" />
                <h3 className="font-semibold text-gray-900">Informações Gerais</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Vendedores Vinculados:</span>
                  <p className="font-semibold text-gray-900 mt-1">
                    {selectedAssociacao.vendedor && selectedAssociacao.vendedor.length > 0
                      ? `${selectedAssociacao.vendedor.length} vendedor(es)`
                      : 'Nenhum vendedor vinculado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedAssociacao.descricao}
              </p>
            </div>

            {/* Localização e Horários */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Endereço */}
              {selectedAssociacao.endereco && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-verde-escuro mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
                      <p className="text-gray-700 text-sm">{selectedAssociacao.endereco}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Horário */}
              {selectedAssociacao.data_hora && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-verde-escuro mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Horário de Funcionamento</h3>
                      <p className="text-gray-700 text-sm">{selectedAssociacao.data_hora}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de Vendedores */}
            {selectedAssociacao.vendedor && selectedAssociacao.vendedor.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-verde-escuro" />
                  <h3 className="font-semibold text-lg text-gray-900">Vendedores Cadastrados</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedAssociacao.vendedor.map((vendedor) => (
                    <div key={vendedor.id_vendedor} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Users className="w-4 h-4 text-verde-escuro" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{vendedor.nome}</h4>
                          <p className="text-sm text-gray-600 mt-1">{vendedor.telefone}</p>
                          <div className="flex gap-2 mt-2">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};
