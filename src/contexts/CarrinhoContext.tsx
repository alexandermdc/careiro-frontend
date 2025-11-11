import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Produto {
  id: string | number;   // Aceita string ou number
  nome: string;
  preco: number;
  imagem?: string;
  vendedor?: string;
  id_vendedor?: string;  // UUID do vendedor
  fk_feira?: string | number; // Aceita string (UUID) ou number
}

interface ItemCarrinho extends Produto {
  quantidade: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (id: string | number) => void;
  atualizarQuantidade: (id: string | number, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  valorTotal: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

const CARRINHO_STORAGE_KEY = 'agriconnect_carrinho';

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  // Inicializar do localStorage
  const [itens, setItens] = useState<ItemCarrinho[]>(() => {
    try {
      const carrinhoSalvo = localStorage.getItem(CARRINHO_STORAGE_KEY);
      if (carrinhoSalvo) {
        return JSON.parse(carrinhoSalvo);
      }
    } catch (error) {
    }
    return [];
  });

  // Salvar no localStorage sempre que itens mudar
  useEffect(() => {
    try {
      localStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(itens));
    } catch (error) {
    }
  }, [itens]);

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

  const removerDoCarrinho = (id: string | number) => {
    setItens((prevItens) => prevItens.filter((item) => item.id !== id));
  };

  const atualizarQuantidade = (id: string | number, quantidade: number) => {
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
