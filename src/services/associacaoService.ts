import api from './api';

export interface Vendedor {
  id_vendedor: string;
  nome: string;
  telefone: string;
  tipo_vendedor: 'PF' | 'PJ';
  tipo_documento?: 'CPF' | 'CNPJ';
  numero_documento?: string;
  image?: string;
}

export interface Associacao {
  id_associacao: string;
  nome: string;
  descricao: string;
  image?: string;
  endereco?: string;
  data_hora?: string;
  disponivel_retirada?: boolean;
  vendedor?: Vendedor[];
}

export interface CreateAssociacaoData {
  nome: string;
  descricao: string;
  image?: string;
  endereco?: string;
  data_hora?: string;
  disponivel_retirada?: boolean;
}

class AssociacaoService {
  private normalizarLista(data: any): Associacao[] {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.associacoes)) return data.associacoes;
    return [];
  }

  async getAll(): Promise<Associacao[]> {
    try {
      const response = await api.get('/associacoes');
      return this.normalizarLista(response.data);
    } catch (errorPlural: any) {
      try {
        const fallbackResponse = await api.get('/associacao');
        return this.normalizarLista(fallbackResponse.data);
      } catch (errorSingular: any) {
        throw new Error(errorSingular.response?.data?.message || errorPlural.response?.data?.message || 'Erro ao buscar associações');
      }
    }
  }

  async getDisponiveisRetirada(): Promise<Associacao[]> {
    try {
      const response = await api.get('/associacoes', {
        params: { disponivel_retirada: true }
      });
      return this.normalizarLista(response.data);
    } catch {
      const todas = await this.getAll();
      return todas.filter((assoc) => assoc.disponivel_retirada === true);
    }
  }

  async getById(id: string): Promise<Associacao> {
    try {
      const response = await api.get(`/associacao/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar associação');
    }
  }

  async create(data: CreateAssociacaoData): Promise<Associacao> {
    try {
      
      const response = await api.post('/associacao/cadastro', data);
      
      return response.data.associacao || response.data;
    } catch (error: any) {
      
      if (error.response?.status === 403) {
        throw new Error('Acesso negado. Apenas administradores podem criar associações.');
      }
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        'Erro ao criar associação';
      
      throw new Error(errorMessage);
    }
  }

  async update(id: string, data: Partial<CreateAssociacaoData>): Promise<Associacao> {
    try {
      const response = await api.put(`/associacao/${id}`, data);
      return response.data.associacao || response.data;
    } catch (error: any) {
      
      if (error.response?.status === 403) {
        throw new Error('Acesso negado. Apenas administradores podem atualizar associações.');
      }
      
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao atualizar associação');
    }
  }

  async atualizarDisponibilidadeRetirada(id: string, disponivel: boolean): Promise<Associacao> {
    try {
      const response = await api.patch(`/associacoes/${id}`, {
        disponivel_retirada: disponivel,
      });
      return response.data.associacao || response.data;
    } catch {
      const response = await api.put(`/associacao/${id}`, {
        disponivel_retirada: disponivel,
      });
      return response.data.associacao || response.data;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/associacao/${id}`);
    } catch (error: any) {
      
      if (error.response?.status === 403) {
        throw new Error('Acesso negado. Apenas administradores podem deletar associações.');
      }
      
      if (error.response?.data?.vendedores_vinculados) {
        throw new Error(`Não é possível deletar associação com ${error.response.data.vendedores_vinculados} vendedor(es) vinculado(s).`);
      }
      
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao deletar associação');
    }
  }
}

export default new AssociacaoService();
