import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Coluna<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface AcaoTabela<T> {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick: (item: T) => void;
}

interface TabelaGerenciamentoProps<T> {
  colunas: Coluna<T>[];
  dados: T[];
  acoes?: AcaoTabela<T>[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
}

export function TabelaGerenciamento<T>({
  colunas,
  dados,
  acoes = [],
  keyExtractor,
  emptyMessage = 'Nenhum item encontrado',
  emptyIcon: EmptyIcon
}: TabelaGerenciamentoProps<T>) {
  // Função auxiliar para obter valor aninhado
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  if (dados.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-12 text-center">
        {EmptyIcon && <EmptyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
        <h3 className="text-xl font-semibold text-gray-600">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-verde-escuro text-white">
            <tr>
              {colunas.map((coluna, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-sm font-semibold ${coluna.className || ''}`}
                >
                  {coluna.label}
                </th>
              ))}
              {acoes.length > 0 && (
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dados.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-gray-50 transition-colors"
              >
                {colunas.map((coluna, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {coluna.render 
                      ? coluna.render(item)
                      : getNestedValue(item, coluna.key as string) || '-'
                    }
                  </td>
                ))}
                {acoes.length > 0 && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {acoes.map((acao, aIndex) => {
                        const IconComponent = acao.icon;
                        return (
                          <button
                            key={aIndex}
                            onClick={() => acao.onClick(item)}
                            className={`p-2 ${acao.color} rounded-lg transition-colors`}
                            title={acao.label}
                          >
                            <IconComponent className="w-5 h-5" />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Exemplo de ações padrão para reutilização
export const acoesComuns = {
  visualizar: (onClick: (item: any) => void): AcaoTabela<any> => ({
    icon: Eye,
    label: 'Ver detalhes',
    color: 'text-blue-600 hover:bg-blue-50',
    onClick
  }),
  
  editar: (onClick: (item: any) => void): AcaoTabela<any> => ({
    icon: Edit,
    label: 'Editar',
    color: 'text-green-600 hover:bg-green-50',
    onClick
  }),
  
  deletar: (onClick: (item: any) => void): AcaoTabela<any> => ({
    icon: Trash2,
    label: 'Deletar',
    color: 'text-red-600 hover:bg-red-50',
    onClick
  })
};
