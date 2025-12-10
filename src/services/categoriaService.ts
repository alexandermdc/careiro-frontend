import api from './api';

export interface Categoria {
  id_categoria: string;
  nome: string;
}

export interface CreateCategoriaData {
  nome: string;
}

class CategoriaService {
  // Listar todas as categorias
  async listarTodas(): Promise<Categoria[]> {
    try {
      const response = await api.get('/categoria');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar categorias'
      );
    }
  }

  // Buscar categoria por ID
  async buscarPorId(id: string): Promise<Categoria> {
    try {
      const response = await api.get(`/categoria/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar categoria'
      );
    }
  }

  // Criar nova categoria (requer autenticação)
  async criar(data: CreateCategoriaData): Promise<Categoria> {
    try {
      const response = await api.post('/categoria', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Erro ao criar categoria'
      );
    }
  }
}

export default new CategoriaService();
