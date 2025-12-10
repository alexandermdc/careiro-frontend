import api from './api';

export interface Feira {
  id_feira: number;
  nome: string;
  endereco: string;
}

export interface CreateFeiraData {
  nome: string;
  endereco: string;
}

class FeiraService {
  /**
   * Listar todas as feiras
   */
  async listarTodas(): Promise<Feira[]> {
    try {
      const response = await api.get('/feira');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar feiras:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar feiras'
      );
    }
  }

  /**
   * Buscar feira por ID
   */
  async buscarPorId(id: number): Promise<Feira> {
    try {

      const response = await api.get(`/feira/${id}`);

      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar feira:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar feira'
      );
    }
  }

  /**
   * Criar nova feira
   */
  async criar(data: CreateFeiraData): Promise<Feira> {
    try {

      const response = await api.post('/feira', data);

      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar feira:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Você precisa estar autenticado para criar uma feira.');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Erro ao criar feira'
      );
    }
  }

  /**
   * Atualizar feira
   */
  async atualizar(id: number, data: Partial<CreateFeiraData>): Promise<Feira> {
    try {

      const response = await api.put(`/feira/${id}`, data);

      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar feira:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Você precisa estar autenticado para atualizar uma feira.');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Erro ao atualizar feira'
      );
    }
  }

  /**
   * Deletar feira
   */
  async deletar(id: number): Promise<void> {
    try {

      await api.delete(`/feira/${id}`);

    } catch (error: any) {
      console.error('❌ Erro ao deletar feira:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Você precisa estar autenticado para deletar uma feira.');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Erro ao deletar feira'
      );
    }
  }
}

export default new FeiraService();
