import React from 'react';
import Modal from './Modal';
import { ShoppingBagIcon, Tag, Package, Heart } from 'lucide-react';

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
  isFavorito
}) => {
  if (!produto) return null;

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarUnidade = (unidade?: string) => {
    if (!unidade) return '';
    const unidades: Record<string, string> = {
      'UNIDADE': 'un',
      'KG': 'kg',
      'MACO': 'maço',
      'LITRO': 'L'
    };
    return unidades[unidade] || '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="2xl"
      showFooter={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna da Imagem */}
        <div className="space-y-4">
          {/* Imagem Principal */}
          {produto.image ? (
            <div className="relative w-full h-96 bg-gray-100 rounded-2xl overflow-hidden">
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
            <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Package className="w-24 h-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Coluna das Informações */}
        <div className="flex flex-col justify-between space-y-6">
          {/* Cabeçalho */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {produto.nome}
                </h2>
                
                {/* Tags */}
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
                      {produto.unidade_medida === 'UNIDADE' ? 'Unidade' :
                       produto.unidade_medida === 'KG' ? 'Quilograma' :
                       produto.unidade_medida === 'MACO' ? 'Maço' : 'Litro'}
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

              {/* Botão Favorito */}
              <button
                onClick={() => onToggleFavorito(produto.id_produto || produto.id || '')}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                title={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart 
                  className={`w-6 h-6 ${
                    isFavorito 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                />
              </button>
            </div>

            {/* Descrição */}
            {produto.descricao && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Descrição
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {produto.descricao}
                </p>
              </div>
            )}

            {/* Informações do Vendedor/Feira */}
            {(produto.feira || produto.vendedor) && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Vendido por
                </h3>
                {produto.feira && (
                  <p className="text-gray-900 font-medium">{produto.feira.nome}</p>
                )}
                {produto.vendedor && (
                  <p className="text-gray-600 text-sm">{produto.vendedor.nome}</p>
                )}
              </div>
            )}
          </div>

          {/* Preço e Ações */}
          <div className="space-y-4">
            {/* Box de Preço */}
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
                      <span className="text-gray-600 text-lg">
                        / {formatarUnidade(produto.unidade_medida)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-green-700">
                    {formatarPreco(produto.preco)}
                  </span>
                  {produto.unidade_medida && (
                    <span className="text-gray-600 text-lg">
                      / {formatarUnidade(produto.unidade_medida)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Botões de Ação */}
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
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetalhesProduto;
