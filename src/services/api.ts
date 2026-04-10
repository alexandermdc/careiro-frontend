import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // URL do backend via .env

// Configuração base do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  // NÃO definir Content-Type aqui - deixar o axios definir automaticamente
  // Isso permite que FormData use multipart/form-data com boundary correto
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const papelAtivo = localStorage.getItem('papelAtivo');
    
    // Garantir que o header existe
    if (!config.headers) {
      config.headers = {} as any;
    }
    
    // Adicionar Content-Type apenas se não for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Adicionar papel ativo como header para o backend saber qual contexto usar
      if (papelAtivo) {
        config.headers['x-user-role'] = papelAtivo;
      }
    }

    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para renovar token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // O backend atual não expõe refresh token; limpar sessão evita loop de tentativas
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('usuario');
      localStorage.removeItem('papelAtivo');
      localStorage.removeItem('ultimoPapelUsado');
    }
    
    return Promise.reject(error);
  }
);

export default api;