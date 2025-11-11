import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import produtoService from '../services/produtoService';
import associacaoService from '../services/associacaoService';

interface Produto {
  id_produto: string;
  nome: string;
  descricao: string;
  preco: number;
  image?: string;
  tipo: 'produto';
}

interface Associacao {
  id_associacao: string;
  nome: string;
  descricao?: string;
  endereco?: string;
  tipo: 'associacao';
}

type ResultadoBusca = Produto | Associacao;

interface BuscaContextType {
  resultados: ResultadoBusca[];
  loading: boolean;
  termoBusca: string;
  buscar: (termo: string) => Promise<void>;
  limparBusca: () => void;
}

const BuscaContext = createContext<BuscaContextType | undefined>(undefined);

export const BuscaProvider = ({ children }: { children: ReactNode }) => {
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');

  const buscar = async (termo: string) => {
    if (!termo || termo.trim().length < 2) {
      setResultados([]);
      setTermoBusca('');
      return;
    }

    try {
      setLoading(true);
      setTermoBusca(termo);


      // Buscar em paralelo em todas as APIs
      const [produtos, associacoes] = await Promise.all([
        produtoService.listarTodos().catch(() => []),
        associacaoService.getAll().catch(() => []),
      ]);

      const termoLower = termo.toLowerCase();

      // Filtrar produtos
      const produtosFiltrados = produtos
        .filter((p: any) => 
          p.nome?.toLowerCase().includes(termoLower) ||
          p.descricao?.toLowerCase().includes(termoLower)
        )
        .map((p: any) => ({ ...p, tipo: 'produto' as const }));

      // Filtrar associações
      const associacoesFiltradas = associacoes
        .filter((a: any) => 
          a.nome?.toLowerCase().includes(termoLower) ||
          a.descricao?.toLowerCase().includes(termoLower) ||
          a.endereco?.toLowerCase().includes(termoLower)
        )
        .map((a: any) => ({ ...a, tipo: 'associacao' as const }));

      // Combinar resultados
      const todosResultados = [
        ...produtosFiltrados,
        ...associacoesFiltradas,
      ];

      setResultados(todosResultados);
      

    } catch (error) {
      console.error('❌ Erro na busca:', error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const limparBusca = () => {
    setResultados([]);
    setTermoBusca('');
  };

  return (
    <BuscaContext.Provider
      value={{
        resultados,
        loading,
        termoBusca,
        buscar,
        limparBusca,
      }}
    >
      {children}
    </BuscaContext.Provider>
  );
};

export const useBusca = () => {
  const context = useContext(BuscaContext);
  if (!context) {
    throw new Error('useBusca deve ser usado dentro de BuscaProvider');
  }
  return context;
};
