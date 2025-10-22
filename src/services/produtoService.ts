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
      console.log('🔍 Buscando todos os produtos...');
      
      const response = await api.get('/produto');
      
      console.log('✅ Produtos encontrados:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar produtos:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar produtos'
      );
    }
  }

  // Buscar produto por ID
  async buscarPorId(id: string): Promise<Produto> {
    try {
      console.log('🔍 Buscando produto por ID:', id);
      
      const response = await api.get(`/produto/${id}`);
      
      console.log('✅ Produto encontrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar produto:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar produto'
      );
    }
  }

  // Criar novo produto (requer autenticação)
  async criar(data: CreateProdutoData): Promise<Produto> {
    try {
      console.log('📝 Criando novo produto...');
      console.log('📋 Dados enviados:', data);
      
      const response = await api.post('/produto/cadastro', data);
      
      console.log('✅ Produto criado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar produto:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
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
      console.log('✏️ Atualizando produto ID:', id);
      console.log('📋 Dados para atualização:', data);
      
      const response = await api.put(`/produto/${id}`, data);
      
      console.log('✅ Produto atualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar produto:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao atualizar produto'
      );
    }
  }

  // Deletar produto (requer autenticação)
  async deletar(id: string): Promise<void> {
    try {
      console.log('🗑️ Deletando produto ID:', id);
      
      await api.delete(`/produto/${id}`);
      
      console.log('✅ Produto deletado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao deletar produto:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao deletar produto'
      );
    }
  }

  // Listar categorias (você pode criar essa rota no backend se não existir)
  async listarCategorias(): Promise<Categoria[]> {
    try {
      console.log('🔍 Buscando categorias do banco...');
      
      const response = await api.get('/categoria');
      
      console.log('✅ Categorias encontradas:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar categorias:', error);
      throw new Error('Erro ao carregar categorias. Tente novamente.');
    }
  }
}

export default new ProdutoService();
