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
  image: File | string; // Pode ser File (upload) ou string (URL)
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

  // Buscar produtos por vendedor
  async buscarPorVendedor(idVendedor: string): Promise<Produto[]> {
    try {
      const response = await api.get(`/produto/vendedor/${idVendedor}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar produtos do vendedor'
      );
    }
  }

  // Criar novo produto (requer autenticação)
  async criar(data: CreateProdutoData): Promise<Produto> {
    try {
      // Criar FormData para enviar arquivo
      const formData = new FormData();

      
      formData.append('nome', data.nome);
      formData.append('descricao', data.descricao);
      formData.append('preco', data.preco.toString());
      formData.append('is_promocao', data.is_promocao.toString());
      formData.append('disponivel', data.disponivel.toString());
      formData.append('fk_vendedor', data.fk_vendedor);
      formData.append('id_categoria', data.id_categoria);
      
      if (data.preco_promocao !== undefined) {
        formData.append('preco_promocao', data.preco_promocao.toString());
      }
      
      // Adicionar arquivo de imagem
      if (data.image instanceof File) {

        formData.append('image', data.image);
      } else {
        console.error('❌ Imagem não é um File:', typeof data.image, data.image);
      }
      

      
      const response = await api.post('/produto/cadastro', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar produto:', error.response?.data || error.message);
      
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
