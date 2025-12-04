import api from './api';

export interface Cliente {
  cpf: string;        // CPF é a chave primária no seu backend
  nome: string;
  email: string;
  telefone: string;
  senha?: string;     // Opcional para não retornar em GETs
}

export interface CreateClienteData {
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface UpdateClienteData {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
}

export interface Produto {
  id_produto: string;
  nome: string;
  descricao: string;
  preco: number;
  preco_promocao?: number;
  is_promocao: boolean;
  image?: string;
  quantidade_estoque?: number;
  fk_feira?: string;
  feira?: {
    nome: string;
  };
}

export interface Favorito {
  cliente_cpf: string;
  produto_id: string;
  produto?: Produto;
}

class ClienteService {
  // Listar todos os clientes (rota pública)
  async listarTodos(): Promise<Cliente[]> {
    try {

      const response = await api.get('/clientes');
  
  
      return response.data;
    } catch (error: any) {
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar clientes'
      );
    }
  }

  // Buscar cliente por CPF
  async buscarPorCpf(cpf: string): Promise<Cliente> {
    try {

      const response = await api.get(`/clientes/${cpf}`);

      return response.data;
    } catch (error: any) {

      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Erro ao buscar cliente'
      );
    }
  }

  // Criar novo cliente (cadastro)
  async criar(data: CreateClienteData): Promise<Cliente> {
    try {

      const response = await api.post('/clientes', data);
      

      return response.data;
    } catch (error: any) {

      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Erro ao criar cliente'
      );
    }
  }

  // Atualizar cliente (requer autenticação)
  async atualizar(cpf: string, data: UpdateClienteData): Promise<Cliente> {
    try {

      
      // Limpar formatação do telefone (remover parênteses, espaços e hífens)
      const cleanData = { ...data };
      if (cleanData.telefone) {
        cleanData.telefone = cleanData.telefone.replace(/\D/g, ''); // Remove tudo que não é número

      }
      

      
      const response = await api.put(`/clientes/${cpf}`, cleanData);
      

      return response.data;
    } catch (error: any) {

      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao atualizar cliente'
      );
    }
  }

  // Deletar cliente (requer autenticação)
  async deletar(cpf: string): Promise<void> {
    try {

      
      await api.delete(`/clientes/${cpf}`);
      

    } catch (error: any) {

      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao deletar cliente'
      );
    }
  }

  // Adicionar produto aos favoritos (requer autenticação)
  async adicionarFavorito(clienteCpf: string, produtoId: string): Promise<any> {
    try {

      
      const response = await api.put(`/clientes/${clienteCpf}/favoritos`, {
        produto_id: produtoId
      });

      return response.data;
    } catch (error: any) {

      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao adicionar favorito'
      );
    }
  }

  // Remover produto dos favoritos (requer autenticação)
  async removerFavorito(clienteCpf: string, produtoId: string): Promise<void> {
    try {

      
      const response = await api.delete(`/clientes/${clienteCpf}/favoritos`, {
        data: { produto_id: produtoId }
      });
      

      return response.data;
    } catch (error: any) {

      throw new Error(
        error.response?.data?.message || 
        'Erro ao remover favorito'
      );
    }
  }

  // Listar produtos favoritos (requer autenticação)
  async listarFavoritos(clienteCpf: string): Promise<Produto[]> {
    try {

      
      const response = await api.get(`/clientes/${clienteCpf}/favoritos`);
      

      
      // Se retornar array de objetos com propriedade 'produto', extrair os produtos
      let produtos: Produto[] = [];
      
      if (Array.isArray(response.data)) {
        produtos = response.data.map((item: any) => {
          // Se o item tem uma propriedade 'produto', usar ela
          if (item.produto) {

            return item.produto;
          }
          // Senão, assumir que o item já é o produto

          return item;
        });
      }
      

      
      return produtos;
    } catch (error: any) {
      console.error('❌ Erro ao listar favoritos:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao listar favoritos'
      );
    }
  }

  // Buscar perfil completo do cliente logado (usado na página de perfil)
  async buscarPerfilCompleto(cpf: string): Promise<{
    cliente: Cliente;
    favoritos: Produto[];
  }> {
    try {

      
      // Buscar dados do cliente e favoritos em paralelo
      const [clienteResponse, favoritosResponse] = await Promise.all([
        this.buscarPorCpf(cpf),
        this.listarFavoritos(cpf).catch(() => []) // Se falhar, retorna array vazio
      ]);
      
      const resultado = {
        cliente: clienteResponse,
        favoritos: favoritosResponse
      };
      

      
      return resultado;
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil completo:', error);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao carregar perfil'
      );
    }
  }
}

export default new ClienteService();