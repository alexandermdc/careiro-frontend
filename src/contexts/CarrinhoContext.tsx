import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem?: string;
  vendedor?: string;
}

interface ItemCarrinho extends Produto {
  quantidade: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  valorTotal: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const adicionarAoCarrinho = (produto: Produto) => {
    setItens((prevItens) => {
      const itemExistente = prevItens.find((item) => item.id === produto.id);
      
      if (itemExistente) {
        return prevItens.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      
      return [...prevItens, { ...produto, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (id: string) => {
    setItens((prevItens) => prevItens.filter((item) => item.id !== id));
  };

  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }
    
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.id === id ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const valorTotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        valorTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
};
