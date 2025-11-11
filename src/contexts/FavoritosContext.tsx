import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import clienteService, { type Produto } from '../services/clienteService';
import { useAuth } from './AuthContext';

interface FavoritosContextType {
  favoritos: Produto[];
  favoritosIds: Set<string>;
  loading: boolean;
  adicionarFavorito: (produto_id: string | number) => Promise<void>;
  removerFavorito: (produto_id: string | number) => Promise<void>;
  toggleFavorito: (produto_id: string | number) => Promise<void>;
  isFavorito: (produto_id: string | number) => boolean;
  carregarFavoritos: () => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState<Produto[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Definir carregarFavoritos antes do useEffect
  const carregarFavoritos = useCallback(async () => {
    if (!user?.cpf) {
      return;
    }

    try {
      setLoading(true);
      
      const produtosFavoritos = await clienteService.listarFavoritos(user.cpf);
      
      
      setFavoritos(produtosFavoritos);
      
      // Criar Set de IDs para consulta rápida - normalizar para string
      const ids = new Set(
        produtosFavoritos.map((p: any) => {
          const id = p.id_produto || p.id;
          const normalizedId = String(id);
          return normalizedId;
        })
      );
      setFavoritosIds(ids);
      
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [user?.cpf]); // Apenas CPF como dependência

  // Carregar favoritos quando o usuário logar
  useEffect(() => {
    
    if (user && user.tipo === 'cliente' && user.cpf) {
      carregarFavoritos();
    } else {
      setFavoritos([]);
      setFavoritosIds(new Set());
    }
  }, [user?.cpf, user?.tipo, carregarFavoritos]); // Incluir carregarFavoritos

  const adicionarFavorito = async (produto_id: string | number) => {
    if (!user?.cpf) {
      throw new Error('Usuário não autenticado');
    }

    try {
      
      await clienteService.adicionarFavorito(user.cpf, String(produto_id));
      
      
      // Atualizar lista local
      await carregarFavoritos();
      
    } catch (error: any) {
      throw error;
    }
  };

  const removerFavorito = async (produto_id: string | number) => {
    if (!user?.cpf) {
      throw new Error('Usuário não autenticado');
    }

    try {
      
      await clienteService.removerFavorito(user.cpf, String(produto_id));
      
      // Atualizar lista local
      await carregarFavoritos();
      
    } catch (error: any) {
      throw error;
    }
  };

  const toggleFavorito = async (produto_id: string | number) => {
    const isFav = isFavorito(produto_id);
    
    if (isFav) {
      await removerFavorito(produto_id);
    } else {
      await adicionarFavorito(produto_id);
    }
  };

  const isFavorito = (produto_id: string | number): boolean => {
    // Normalizar para string para garantir comparação consistente
    const normalizedId = String(produto_id);
    const resultado = favoritosIds.has(normalizedId);
    return resultado;
  };

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        favoritosIds,
        loading,
        adicionarFavorito,
        removerFavorito,
        toggleFavorito,
        isFavorito,
        carregarFavoritos,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  }
  return context;
};
