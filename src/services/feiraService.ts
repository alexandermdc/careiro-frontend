import api from './api';

export interface Feira {
  id_feira: number;
  nome: string;
  data_hora?: string | null;
  descricao?: string | null;
  localizacao?: string | null;
  image?: string | null;
}

export interface CreateFeiraData {
  nome: string;
  data_hora?: string;
  descricao?: string;
  localizacao?: string;
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


      // Converter File para Base64 se necessário
      let imageBase64: string | undefined;
      
      if (data.image instanceof File) {

        imageBase64 = await this.fileToBase64(data.image);

      } else if (typeof data.image === 'string' && data.image) {

        imageBase64 = data.image;
      }

      const payload = {
        nome: data.nome,
        ...(data.data_hora && { data_hora: data.data_hora }),
        ...(data.descricao && { descricao: data.descricao }),
        ...(data.localizacao && { localizacao: data.localizacao }),
        ...(imageBase64 && { image: imageBase64 })
      };
      

      
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
      // Converter File para Base64 se necessário
      let imageBase64: string | undefined;
      
      if (data.image instanceof File) {
        imageBase64 = await this.fileToBase64(data.image);
      } else if (typeof data.image === 'string') {
        imageBase64 = data.image;
      }

      const payload = {
        ...(data.nome && { nome: data.nome }),
        ...(data.data_hora !== undefined && { data_hora: data.data_hora }),
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.localizacao !== undefined && { localizacao: data.localizacao }),
        ...(imageBase64 && { image: imageBase64 })
      };

      const response = await api.put(`/feira/${id}`, payload);

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

  /**
   * Converter File para Base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}

export default new FeiraService();
