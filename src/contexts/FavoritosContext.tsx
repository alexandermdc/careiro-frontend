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
      console.log('⚠️ carregarFavoritos: sem CPF do usuário');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Carregando favoritos do cliente:', user.cpf);
      
      const produtosFavoritos = await clienteService.listarFavoritos(user.cpf);
      
      console.log('📦 Produtos favoritos recebidos:', produtosFavoritos);
      console.log('📊 Total de favoritos:', produtosFavoritos.length);
      
      setFavoritos(produtosFavoritos);
      
      // Criar Set de IDs para consulta rápida - normalizar para string
      const ids = new Set(
        produtosFavoritos.map((p: any) => {
          const id = p.id_produto || p.id;
          const normalizedId = String(id);
          console.log('🆔 ID mapeado:', normalizedId, 'para produto:', p.nome);
          return normalizedId;
        })
      );
      setFavoritosIds(ids);
      
      console.log('✅ Favoritos carregados:', produtosFavoritos.length);
      console.log('🆔 IDs dos favoritos (normalizados):', Array.from(ids));
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.cpf]); // Apenas CPF como dependência

  // Carregar favoritos quando o usuário logar
  useEffect(() => {
    console.log('👤 useEffect FavoritosContext - DISPARADO!');
    console.log('   user:', user);
    console.log('   user?.tipo:', user?.tipo);
    console.log('   user?.cpf:', user?.cpf);
    console.log('   Condição completa:', user && user.tipo === 'cliente' && user.cpf);
    
    if (user && user.tipo === 'cliente' && user.cpf) {
      console.log('✅ Usuário válido, chamando carregarFavoritos...');
      carregarFavoritos();
    } else {
      console.log('❌ Condições não atendidas:');
      console.log('   - user existe?', !!user);
      console.log('   - tipo === cliente?', user?.tipo === 'cliente');
      console.log('   - tem CPF?', !!user?.cpf);
      console.log('   Limpando favoritos...');
      setFavoritos([]);
      setFavoritosIds(new Set());
    }
  }, [user?.cpf, user?.tipo, carregarFavoritos]); // Incluir carregarFavoritos

  const adicionarFavorito = async (produto_id: string | number) => {
    if (!user?.cpf) {
      console.error('❌ Tentou adicionar favorito sem usuário autenticado');
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('⭐ Adicionando favorito:', produto_id);
      console.log('👤 CPF do usuário:', user.cpf);
      
      await clienteService.adicionarFavorito(user.cpf, String(produto_id));
      
      console.log('✅ Favorito adicionado no backend, recarregando lista...');
      
      // Atualizar lista local
      await carregarFavoritos();
      
      console.log('✅ Lista de favoritos recarregada!');
      console.log('📊 Total de favoritos agora:', favoritos.length);
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
    // Normalizar para string para garantir comparação consistente
    const normalizedId = String(produto_id);
    const resultado = favoritosIds.has(normalizedId);
    console.log(`🔍 Verificando se produto ${normalizedId} é favorito:`, resultado);
    console.log('📋 IDs favoritos disponíveis:', Array.from(favoritosIds));
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
