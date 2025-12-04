import api from './api';

export interface ItemPedido {
  produto_id: string;
  quantidade: number;
  id_vendedor: string;
}

export interface CriarPedidoDTO {
  data_pedido: string;
  fk_feira: number | null;
  produtos: ItemPedido[];
}

export interface Pedido {
  pedido_id: number;
  data_pedido: string;
  fk_feira: number | null;
  fk_cliente: string;
  atende_um?: any[];
  produtos_no_pedido?: any[]; // Novo campo retornado pelo backend
  cliente?: any;
  feira?: any;
}

class PedidoService {
  /**
   * Listar todos os pedidos do usuário autenticado
   */
  async listarPedidos(): Promise<Pedido[]> {
    try {

      const response = await api.get('/pedido');

      
      // Verificar se response.data é um objeto de cliente (erro do backend)
      if (response.data && response.data.cpf && response.data.nome) {
        console.error('❌ A API retornou dados do cliente ao invés de pedidos!');

        
        // Tenta rota alternativa
        try {
          const altResponse = await api.get('/pedido/lista');
          return Array.isArray(altResponse.data) ? altResponse.data : [];
        } catch (altError) {
          console.error('❌ Rota alternativa também falhou');
          return [];
        }
      }
      
      // Se a resposta for um objeto com uma propriedade que contém o array
      if (response.data && !Array.isArray(response.data)) {
        // Tenta encontrar o array dentro do objeto
        const possibleArray = response.data.pedidos || response.data.data || response.data.results;
        if (Array.isArray(possibleArray)) {
     ;
          return possibleArray;
        }
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Erro ao buscar pedidos:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ URL:', error.config?.url);
      throw error;
    }
  }

  /**
   * Listar pedidos por CPF do cliente
   */
  async listarPorCliente(cpf: string): Promise<Pedido[]> {
    try {
      const response = await api.get(`/pedido/cliente/${cpf}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos por cliente:', error);
      throw error;
    }
  }

  /**
   * Listar todos os pedidos (admin) e filtrar no frontend
   */
  async listarTodos(): Promise<Pedido[]> {
    try {
      const response = await api.get('/pedidos'); // Note o plural
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ Erro ao buscar todos pedidos:', error);
      throw error;
    }
  }

  /**
   * Buscar um pedido específico por ID
   */
  async buscarPorId(id: number): Promise<Pedido> {
    const response = await api.get(`/pedido/${id}`);
    return response.data;
  }

  /**
   * Criar um novo pedido com produtos
   */
  async criarPedido(dados: CriarPedidoDTO): Promise<Pedido> {
    const response = await api.post('/pedido/cadastro', dados);
    return response.data;
  }

  /**
   * Atualizar um pedido existente
   */
  async atualizarPedido(id: number, dados: Partial<CriarPedidoDTO>): Promise<Pedido> {
    const response = await api.put(`/pedido/${id}`, dados);
    return response.data;
  }

  /**
   * Deletar um pedido
   */
  async deletarPedido(id: number): Promise<void> {
    await api.delete(`/pedido/${id}`);
  }
}

export default new PedidoService();
