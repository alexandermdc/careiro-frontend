import api from './api';

export interface Vendedor {
  id_vendedor: string;
  nome: string;
  telefone: string;
  tipo_vendedor: 'PF' | 'PJ';
  tipo_documento?: 'CPF' | 'CNPJ';
  numero_documento?: string;
}

export interface Associacao {
  id_associacao: string;
  nome: string;
  descricao: string;
  vendedor?: Vendedor[];
}

export interface CreateAssociacaoData {
  nome: string;
  descricao: string;
}

class AssociacaoService {
  async getAll(): Promise<Associacao[]> {
    try {
      console.log('🔍 Buscando todas as associações...');
      const response = await api.get('/associacao');
      console.log('✅ Associações encontradas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar associações:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar associações');
    }
  }

  async getById(id: string): Promise<Associacao> {
    try {
      console.log('🔍 Buscando associação por ID:', id);
      const response = await api.get(`/associacao/${id}`);
      console.log('✅ Associação encontrada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar associação:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar associação');
    }
  }

  async create(data: CreateAssociacaoData): Promise<Associacao> {
    try {
      console.log('📝 Criando nova associação...');
      console.log('📋 Dados enviados:', JSON.stringify(data, null, 2));
      
      const response = await api.post('/associacao/cadastro', data);
      
      console.log('✅ Associação criada com sucesso:', response.data);
      return response.data.associacao || response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar associação:', error);
      
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
      console.log('📝 Atualizando associação:', id);
      const response = await api.put(`/associacao/${id}`, data);
      console.log('✅ Associação atualizada com sucesso:', response.data);
      return response.data.associacao || response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar associação:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Acesso negado. Apenas administradores podem atualizar associações.');
      }
      
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao atualizar associação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Deletando associação:', id);
      await api.delete(`/associacao/${id}`);
      console.log('✅ Associação deletada com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao deletar associação:', error);
      
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
