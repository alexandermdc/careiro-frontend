import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { UserType } from '../services/authService';

// Tipo unificado para cliente, vendedor ou admin
interface AppUser {
  tipo: UserType;
  nome: string;
  email: string;
  cpf?: string;
  id_vendedor?: string;
  telefone?: string;
  tipo_vendedor?: 'PF' | 'PJ';
  endereco_venda?: string;
  numero_documento?: string;
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
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Detectar automaticamente se é cliente, vendedor ou admin
      const userData = response.cliente || response.vendedor;
      if (userData) {
        setUser(userData as AppUser);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @deprecated Use login() ao invés disso - agora é unificado
   */
  const loginVendedor = async (id_vendedor: string, password: string): Promise<void> => {
    // Por compatibilidade, redireciona para login unificado
    return login(id_vendedor, password);
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