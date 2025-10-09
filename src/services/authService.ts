import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VendedorLoginCredentials {
  id_vendedor: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  cliente: {
    nome: string;
    email: string;
    cpf: string;
  };
}

export interface VendedorAuthResponse {
  accessToken: string;
  refreshToken: string;
  vendedor: {
    id_vendedor: string;
    nome: string;
    telefone: string;
    endereco_venda: string;
    tipo_vendedor: 'PF' | 'PJ';
    tipo_documento: 'CPF' | 'CNPJ';
    numero_documento: string;
    associacao?: {
      id_associacao: string;
      nome: string;
    } | null;
  };
}

export interface User {
  nome: string;
  email: string;
  cpf: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        senha: credentials.password
      });
      
      const { accessToken, refreshToken, cliente } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({
        ...cliente,
        tipo: 'cliente'
      }));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro no login');
    }
  }

  async loginVendedor(credentials: VendedorLoginCredentials): Promise<VendedorAuthResponse> {
    try {
      console.log('🔐 Login de vendedor...');
      
      const response = await api.post('/auth/login/vendedor', {
        id_vendedor: credentials.id_vendedor,
        senha: credentials.password
      });
      
      const { accessToken, refreshToken, vendedor } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({
        ...vendedor,
        tipo: 'vendedor'
      }));
      
      console.log('✅ Login de vendedor realizado');
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro no login de vendedor:', error);
      throw new Error(error.response?.data?.error || 'Erro no login do vendedor');
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/refresh/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
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

  isVendedor(): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === 'vendedor';
  }

  isCliente(): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === 'cliente';
  }
}

export default new AuthService();
