import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { ShoppingBagIcon, Tag, Package, Heart } from 'lucide-react';
import feiraService from '../services/feiraService';
import vendedorService from '../services/vendedorService';
import associacaoService from '../services/associacaoService';

  interface ModalDetalhesProdutoProps {
    isOpen: boolean;
    onClose: () => void;
    produto: any | null;
    onAdicionarCarrinho: (produto: any) => void;
    onToggleFavorito: (produtoId: string | number) => void;
    isFavorito: boolean;
  }

  export const ModalDetalhesProduto: React.FC<ModalDetalhesProdutoProps> = ({
    isOpen,
    onClose,
    produto,
    onAdicionarCarrinho,
    onToggleFavorito,
    isFavorito,
  }) => {
    const [vendedorNomeCarregado, setVendedorNomeCarregado] = useState('');
    const [feiraNomeCarregada, setFeiraNomeCarregada] = useState('');
    const [associacaoNomeCarregada, setAssociacaoNomeCarregada] = useState('');

    const produtoAny = produto as any;

    const formatarPreco = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor);
    };

    const formatarUnidade = (unidade?: string) => {
      if (!unidade) return '';
      const unidades: Record<string, string> = {
        UNIDADE: 'un',
        KG: 'kg',
        MACO: 'maço',
        LITRO: 'L',
      };
      return unidades[unidade] || '';
    };

    const vendedorId =
      produtoAny?.fk_vendedor ||
      produtoAny?.id_vendedor ||
      produtoAny?.vendedor?.id_vendedor ||
      '';

    const feiraId =
      produtoAny?.fk_feira ||
      produtoAny?.id_feira ||
      produtoAny?.feira?.id_feira ||
      produtoAny?.feira?.id ||
      '';

    const associacaoId =
      produtoAny?.fk_associacao ||
      produtoAny?.id_associacao ||
      produtoAny?.vendedor?.fk_associacao ||
      produtoAny?.vendedor?.associacao?.id_associacao ||
      '';

    const vendedorNome =
      vendedorNomeCarregado ||
      produtoAny?.vendedor?.nome ||
      produtoAny?.vendedor?.nome_vendedor ||
      produtoAny?.nome_vendedor ||
      produtoAny?.vendedor_nome ||
      '';

    const feiraNome =
      feiraNomeCarregada ||
      produtoAny?.feira?.nome ||
      produtoAny?.nome_feira ||
      produtoAny?.feira_nome ||
      '';

    const associacaoNome =
      associacaoNomeCarregada ||
      produtoAny?.associacao?.nome ||
      produtoAny?.vendedor?.associacao?.nome ||
      produtoAny?.nome_associacao ||
      produtoAny?.associacao_nome ||
      '';

    useEffect(() => {
      let ativo = true;

      const carregarDados = async () => {
        if (!isOpen || !produto) return;

        setVendedorNomeCarregado('');
        setFeiraNomeCarregada('');
        setAssociacaoNomeCarregada('');

        if (produtoAny?.vendedor?.nome) {
          setVendedorNomeCarregado(produtoAny.vendedor.nome);
        }

        if (produtoAny?.feira?.nome) {
          setFeiraNomeCarregada(produtoAny.feira.nome);
        }

        if (produtoAny?.associacao?.nome) {
          setAssociacaoNomeCarregada(produtoAny.associacao.nome);
        }

        try {
          if (feiraId && !produtoAny?.feira?.nome) {
            const feira = await feiraService.buscarPorId(Number(feiraId));
            if (ativo && feira?.nome) {
              setFeiraNomeCarregada(feira.nome);
            }
          }

          if (vendedorId) {
            const vendedor = await vendedorService.buscarPorId(String(vendedorId));
            if (!ativo) return;

            if (vendedor.nome) {
              setVendedorNomeCarregado(vendedor.nome);
            }

            const assocIdDoVendedor = vendedor.fk_associacao || vendedor.associacao?.id_associacao;

            if (vendedor.associacao?.nome) {
              setAssociacaoNomeCarregada(vendedor.associacao.nome);
            } else if (assocIdDoVendedor) {
              const associacao = await associacaoService.getById(String(assocIdDoVendedor));
              if (ativo && associacao?.nome) {
                setAssociacaoNomeCarregada(associacao.nome);
              }
            }
          } else if (associacaoId && !produtoAny?.associacao?.nome) {
            const associacao = await associacaoService.getById(String(associacaoId));
            if (ativo && associacao?.nome) {
              setAssociacaoNomeCarregada(associacao.nome);
            }
          }
        } catch {
          // mantém o que já veio no produto
        }
      };

      carregarDados();

      return () => {
        ativo = false;
      };
    }, [isOpen, produto, vendedorId, feiraId, associacaoId, produtoAny]);

    if (!produto) return null;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title=""
        maxWidth="2xl"
        showFooter={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-full">
            {produto.image ? (
              <div className="relative w-full h-full min-h-[620px] bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={produto.image}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
                {produto.is_promocao && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🔥 PROMOÇÃO
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full min-h-[620px] bg-gray-100 rounded-2xl flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {produto.nome}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {produto.categoria && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                        <Tag className="w-3 h-3" />
                        {produto.categoria.nome}
                      </span>
                    )}
                    {produto.unidade_medida && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                        <Package className="w-3 h-3" />
                        {produto.unidade_medida === 'UNIDADE'
                          ? 'Unidade'
                          : produto.unidade_medida === 'KG'
                            ? 'Quilograma'
                            : produto.unidade_medida === 'MACO'
                              ? 'Maço'
                              : 'Litro'}
                      </span>
                    )}
                    {produto.disponivel ? (
                      <span className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full font-medium">
                        ✓ Disponível
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onToggleFavorito(produto.id_produto || produto.id || '')}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                  title={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorito ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
                    }`}
                  />
                </button>
              </div>

            </div>

            <div className="space-y-4">
              {produto.descricao && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-700 leading-relaxed">{produto.descricao}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                {produto.is_promocao && produto.preco_promocao ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-lg">
                        {formatarPreco(produto.preco)}
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {Math.round((1 - produto.preco_promocao / produto.preco) * 100)}% OFF
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-green-700">
                        {formatarPreco(produto.preco_promocao)}
                      </span>
                      {produto.unidade_medida && (
                        <span className="text-gray-600 text-lg">/ {formatarUnidade(produto.unidade_medida)}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-green-700">{formatarPreco(produto.preco)}</span>
                    {produto.unidade_medida && (
                      <span className="text-gray-600 text-lg">/ {formatarUnidade(produto.unidade_medida)}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onAdicionarCarrinho(produto);
                    onClose();
                  }}
                  disabled={!produto.disponivel}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                    produto.disponivel
                      ? 'bg-verde-claro text-white hover:bg-verde-escuro shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBagIcon className="w-6 h-6" />
                  {produto.disponivel ? 'Adicionar à Sacola' : 'Indisponível'}
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Informações do produto</h3>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Vendedor</p>
                  <p className="text-gray-900 font-medium">{vendedorNome || 'Não informado'}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Feira</p>
                  <p className="text-gray-600 text-sm">{feiraNome || 'Não informado'}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Associação</p>
                  <p className="text-gray-600 text-sm">{associacaoNome || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  export default ModalDetalhesProduto;
