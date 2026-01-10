import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { UserType, Cliente, Vendedor } from '../services/authService';

// Interface para dados do usuário no contexto
interface AppUser {
  tipo: UserType; // Papel ativo
  papeis: UserType[]; // Todos os papéis
  nome: string;
  email: string;
  // Dados específicos por papel
  cliente?: Cliente;
  vendedor?: Vendedor;
}

interface AuthContextData {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType | null;
  isAdmin: boolean;
  isVendedor: boolean;
  isCliente: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsVendedor: (email: string, password: string) => Promise<void>;
  loginVendedor: (id_vendedor: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário logado ao inicializar
    try {
      const usuario = authService.getCurrentUser();
      if (usuario && authService.isAuthenticated()) {
        const papelAtivo = authService.getPapelAtivo() || usuario.papeis[0];
        
        setUser({
          tipo: papelAtivo,
          papeis: usuario.papeis,
          nome: usuario.cliente?.nome || usuario.vendedor?.nome || '',
          email: usuario.email,
          cliente: usuario.cliente,
          vendedor: usuario.vendedor
        });
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do localStorage:', error);
      // Limpar dados corrompidos
      localStorage.removeItem('usuario');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('papelAtivo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Nova estrutura com usuario.papeis
      const { usuario } = response;
      if (usuario) {
        const papelAtivo = authService.getPapelAtivo() || usuario.papeis[0];
        setUser({
          tipo: papelAtivo,
          papeis: usuario.papeis,
          nome: usuario.cliente?.nome || usuario.vendedor?.nome || '',
          email: usuario.email,
          cliente: usuario.cliente,
          vendedor: usuario.vendedor
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsVendedor = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.loginAsVendedor({ email, password });
      
      const { usuario } = response;
      if (usuario) {
  
        setUser({
          tipo: 'VENDEDOR',
          papeis: ['VENDEDOR'],
          nome: usuario.vendedor?.nome || '',
          email: usuario.email,
          vendedor: usuario.vendedor
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @deprecated Use loginAsVendedor() ao invés disso
   */
  const loginVendedor = async (id_vendedor: string, password: string): Promise<void> => {
    return loginAsVendedor(id_vendedor, password);
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && authService.isAuthenticated();
  const userType = authService.getUserType();
  const isAdmin = authService.isAdmin();
  const isVendedor = authService.isVendedor();
  const isCliente = authService.isCliente();

  // Debug log

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        userType,
        isAdmin,
        isVendedor,
        isCliente,
        login,
        loginAsVendedor,
        loginVendedor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};