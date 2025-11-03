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
  cliente?: any;
  feira?: any;
}

class PedidoService {
  /**
   * Listar todos os pedidos do usuário autenticado
   */
  async listarPedidos(): Promise<Pedido[]> {
    const response = await api.get('/pedido');
    return response.data;
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
    console.log('📦 Criando pedido:', dados);
    const response = await api.post('/pedido/cadastro', dados);
    console.log('✅ Pedido criado:', response.data);
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
