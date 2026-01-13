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
  cpf_cliente?: string; // Obrigatório quando vendedor faz pedido
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
  mercadopago_payment_id?: string | null;
}

export interface MetaPaginacao {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: MetaPaginacao;
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
      const response = await api.get('/pedido');
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
   * Listar pedidos por status de pagamento (ex.: PAGO)
   */
  async listarPorStatus(status = 'PAGO', page = 1, limit = 25): Promise<PaginatedResponse<Pedido>> {
    try {
      const params: any = { status, page, limit };
      const response = await api.get('/pedido/pagos', { params });

      // Espera formato { data: [...], meta: { total, page, limit, totalPages } }
      if (response.data && response.data.data && response.data.meta) {
        return response.data as PaginatedResponse<Pedido>;
      }

      // Fallback: caso backend retorne array sem meta
      const dataArray = Array.isArray(response.data) ? response.data : [];
      return { data: dataArray, meta: { total: dataArray.length, page, limit, totalPages: 1 } };
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos por status:', error);
      throw error;
    }
  }

  /**
   * Buscar pedido pelo `mercadopago_payment_id`
   */
  async buscarPorPaymentId(paymentId: string): Promise<Pedido | null> {
    try {
      const response = await api.get(`/pedido/por-pagamento/${paymentId}`);
      return response.data || null;
    } catch (error: any) {
      if (error.response && error.response.status === 404) return null;
      console.error('❌ Erro ao buscar pedido por paymentId:', error);
      throw error;
    }
  }

  /**
   * Listar pedidos via rota admin com filtros e paginação
   */
  async listarAdminPedidos(opts: { status?: string; payer_email?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<Pedido>> {
    try {
      const params: any = {};
      if (opts.status) params.status = opts.status;
      if (opts.payer_email) params.payer_email = opts.payer_email;
      params.page = opts.page ?? 1;
      params.limit = opts.limit ?? 25;

      const response = await api.get('/pedido/admin/pedidos', { params });

      if (response.data && response.data.data && response.data.meta) {
        return response.data as PaginatedResponse<Pedido>;
      }

      const dataArray = Array.isArray(response.data) ? response.data : [];
      return { data: dataArray, meta: { total: dataArray.length, page: params.page, limit: params.limit, totalPages: 1 } };
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos admin:', error);
      throw error;
    }
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
