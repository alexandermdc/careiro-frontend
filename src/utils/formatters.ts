import type { UnidadeMedida } from '../services/produtoService';

export const formatarUnidadeMedida = (unidade?: UnidadeMedida): string => {
  if (!unidade) return 'un';
  
  const unidades: Record<UnidadeMedida, string> = {
    'UNIDADE': 'un',
    'KG': 'kg',
    'MACO': 'maço',
    'LITRO': 'L'
  };
  
  return unidades[unidade] || 'un';
};

export const formatarUnidadeMedidaCompleta = (unidade?: UnidadeMedida): string => {
  if (!unidade) return 'Unidade';
  
  const unidades: Record<UnidadeMedida, string> = {
    'UNIDADE': 'Unidade',
    'KG': 'Quilograma',
    'MACO': 'Maço',
    'LITRO': 'Litro'
  };
  
  return unidades[unidade] || 'Unidade';
};

export const formatarPrecoComUnidade = (preco: number, unidade?: UnidadeMedida): string => {
  const unidadeFormatada = formatarUnidadeMedida(unidade);
  return `R$ ${preco.toFixed(2)}/${unidadeFormatada}`;
};
