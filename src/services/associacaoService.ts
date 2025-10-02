import api from './api';

export interface Associacao {
  id_associacao: string;
  nome: string;
  descricao: string;
  vendedor: string;
}

export interface CreateAssociacaoData {
  id_associacao: string;
  nome: string;
  descricao: string;
  vendedor: string;
}

class AssociacaoService {
  // Buscar todas as associações (rota pública)
  async getAll(): Promise<Associacao[]> {
    const response = await api.get('/associacao');
    return response.data;
  }

  // Buscar associação por ID (rota pública)
  async getById(id: string): Promise<Associacao> {
    const response = await api.get(`/associacao/${id}`);
    return response.data;
  }

  // Criar associação (requer autenticação)
  async create(data: CreateAssociacaoData): Promise<Associacao> {
    const response = await api.post('/associacao/cadastro', data);
    return response.data;
  }

  // Atualizar associação (requer autenticação)
  async update(id: string, data: Partial<CreateAssociacaoData>): Promise<Associacao> {
    const response = await api.put(`/associacao/${id}`, data);
    return response.data;
  }

  // Deletar associação (requer autenticação)
  async delete(id: string): Promise<void> {
    await api.delete(`/associacao/${id}`);
  }
}

export default new AssociacaoService();