import api from './api';

export interface LoginCredentials {
  email: string;
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
      localStorage.setItem('user', JSON.stringify(cliente));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro no login');
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

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();
