import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import clienteService from '../services/clienteService';
import { useAuth } from './AuthContext';

interface Produto {
  id: string | number;
  nome: string;
  preco: number;
  descricao?: string;
  image?: string;
  disponivel?: boolean;
}

interface FavoritosContextType {
  favoritos: Produto[];
  favoritosIds: Set<string | number>;
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
  const [favoritosIds, setFavoritosIds] = useState<Set<string | number>>(new Set());
  const [loading, setLoading] = useState(false);

  // Carregar favoritos quando o usuário logar
  useEffect(() => {
    if (user && user.tipo === 'cliente' && user.cpf) {
      carregarFavoritos();
    } else {
      setFavoritos([]);
      setFavoritosIds(new Set());
    }
  }, [user]);

  const carregarFavoritos = async () => {
    if (!user?.cpf) return;

    try {
      setLoading(true);
      console.log('🔄 Carregando favoritos do cliente:', user.cpf);
      
      const produtosFavoritos = await clienteService.listarFavoritos(user.cpf);
      
      setFavoritos(produtosFavoritos);
      
      // Criar Set de IDs para consulta rápida
      const ids = new Set(
        produtosFavoritos.map((p: any) => p.id_produto || p.id)
      );
      setFavoritosIds(ids);
      
      console.log('✅ Favoritos carregados:', produtosFavoritos.length);
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarFavorito = async (produto_id: string | number) => {
    if (!user?.cpf) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('⭐ Adicionando favorito:', produto_id);
      
      await clienteService.adicionarFavorito(user.cpf, String(produto_id));
      
      // Atualizar lista local
      await carregarFavoritos();
      
      console.log('✅ Favorito adicionado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao adicionar favorito:', error);
      throw error;
    }
  };

  const removerFavorito = async (produto_id: string | number) => {
    if (!user?.cpf) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('Removendo favorito:', produto_id);
      
      await clienteService.removerFavorito(user.cpf, String(produto_id));
      
      // Atualizar lista local
      await carregarFavoritos();
      
      console.log('✅ Favorito removido com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao remover favorito:', error);
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
    return favoritosIds.has(produto_id);
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
