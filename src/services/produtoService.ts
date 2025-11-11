import api from './api';

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    disponivel: boolean;
    quantidade_estoque?: number; // Opcional - backend pode não retornar
    fk_feira?: number; // Opcional - backend pode não retornar
    image?: string;
    feira?: {
        id: number;
        nome: string;
    };
}

export interface CreateProdutoData {
  nome: string;
  descricao: string;
  image: string;
  is_promocao: boolean;
  preco: number;
  preco_promocao?: number;
  fk_vendedor: string;
  id_categoria: string;
  disponivel: boolean;
}

export interface UpdateProdutoData {
  nome?: string;
  descricao?: string;
  imagem?: string;
  is_promocao?: boolean;
  preco?: number;
  preco_promocao?: number;
  id_categoria?: string;
  disponivel?: boolean;
}

export interface Categoria {
  id_categoria: string;
  nome: string;
}

class ProdutoService {
  // Listar todos os produtos
  async listarTodos(): Promise<Produto[]> {
    try {
      
      const response = await api.get('/produto');
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar produtos'
      );
    }
  }

  // Buscar produto por ID
  async buscarPorId(id: string): Promise<Produto> {
    try {
      
      const response = await api.get(`/produto/${id}`);
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar produto'
      );
    }
  }

  // Criar novo produto (requer autenticação)
  async criar(data: CreateProdutoData): Promise<Produto> {
    try {
      
      const response = await api.post('/produto/cadastro', data);
      
      return response.data;
    } catch (error: any) {
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Erro ao criar produto'
      );
    }
  }

  // Atualizar produto (requer autenticação)
  async atualizar(id: string, data: UpdateProdutoData): Promise<Produto> {
    try {
      
      const response = await api.put(`/produto/${id}`, data);
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erro ao atualizar produto'
      );
    }
  }

  // Deletar produto (requer autenticação)
  async deletar(id: string): Promise<void> {
    try {
      
      await api.delete(`/produto/${id}`);
      
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erro ao deletar produto'
      );
    }
  }

  // Listar categorias (você pode criar essa rota no backend se não existir)
  async listarCategorias(): Promise<Categoria[]> {
    try {
      
      const response = await api.get('/categoria');
      
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao carregar categorias. Tente novamente.');
    }
  }
}

export default new ProdutoService();
