import api from './api';

export interface Feira {
  id_feira: number;
  nome: string;
  data_hora?: string | null;
  descricao?: string | null;
  image?: string | null;
}

export interface CreateFeiraData {
  nome: string;
  data_hora?: string;
  descricao?: string;
  image?: File | string;
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
      // Se tiver arquivo de imagem, usar FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('nome', data.nome);
        
        if (data.data_hora) formData.append('data_hora', data.data_hora);
        if (data.descricao) formData.append('descricao', data.descricao);
        formData.append('image', data.image);

        console.log('📤 Enviando feira com imagem (FormData)');
        const response = await api.post('/feira', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }

      // Caso contrário, enviar JSON normal (sem imagem ou imagem como string)
      const payload = {
        nome: data.nome,
        ...(data.data_hora && { data_hora: data.data_hora }),
        ...(data.descricao && { descricao: data.descricao }),
        ...(data.image && typeof data.image === 'string' && { image: data.image })
      };
      
      console.log('📤 Enviando feira sem arquivo (JSON):', payload);
      const response = await api.post('/feira', payload);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar feira:', error);
      console.error('❌ Resposta do servidor:', error.response?.data);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Você precisa estar autenticado para criar uma feira.');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        `Erro ao criar feira (${error.response?.status || 'sem resposta'})`
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
