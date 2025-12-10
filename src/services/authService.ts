import api from './api';
import logger from '../utils/logger';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipo de usuário retornado pelo backend
export type UserType = 'CLIENTE' | 'VENDEDOR' | 'ADMIN';

export interface AuthResponse {
  token?: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  cliente?: {
    cpf: string;
    nome: string;
    email: string;
    telefone: string;
    tipo: UserType;
  };
  vendedor?: {
    id_vendedor: string;
    nome: string;
    email: string;
    telefone: string;
    endereco_venda: string;
    tipo_vendedor: 'PF' | 'PJ';
    tipo_documento: 'CPF' | 'CNPJ';
    numero_documento: string;
    associacao?: {
      id_associacao: string;
      nome: string;
    } | null;
    tipo: UserType;
  };
}

export interface User {
  nome: string;
  email: string;
  cpf?: string;
  id_vendedor?: string;
  tipo: UserType;
}

class AuthService {
  /**
   * Login unificado - funciona para Cliente, Vendedor e Admin
   * O backend detecta automaticamente o tipo de usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        senha: credentials.password
      });
      
      const { token, accessToken, refreshToken, cliente, vendedor } = response.data;
      
      // Usar 'token' ou 'accessToken'
      const finalToken = token || accessToken;
      
      // Determinar tipo de usuário
      const userType = cliente?.tipo || vendedor?.tipo;
      const userData = cliente || vendedor;
      
      if (!userData || !userType) {
        throw new Error('Resposta de login inválida');
      }
      
      // Salvar tokens e dados do usuário
      localStorage.setItem('accessToken', finalToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userType', userType);
      localStorage.setItem('user', JSON.stringify(userData));
      
      logger.success(`Login realizado com sucesso como ${userType}`);
      
      return response.data;
    } catch (error: any) {
      logger.error('Erro ao fazer login', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Erro no login'
      );
    }
  }

  /**
   * @deprecated Use login() ao invés disso - agora é unificado
   */
  async loginVendedor(credentials: { id_vendedor: string; password: string }): Promise<AuthResponse> {
    logger.warn('loginVendedor está deprecated, use login()');
    // Por compatibilidade, redireciona para login unificado
    return this.login({
      email: credentials.id_vendedor,
      password: credentials.password
    });
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/refresh/logout', { refreshToken });
      }
      logger.info('Logout realizado');
    } catch (error) {
      logger.warn('Erro ao fazer logout no servidor', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserType(): UserType | null {
    const userType = localStorage.getItem('userType');
    return userType as UserType | null;
  }

  isVendedor(): boolean {
    const userType = this.getUserType();
    return userType === 'VENDEDOR';
  }

  isCliente(): boolean {
    const userType = this.getUserType();
    return userType === 'CLIENTE';
  }

  isAdmin(): boolean {
    const userType = this.getUserType();
    return userType === 'ADMIN';
  }
}

export default new AuthService();
