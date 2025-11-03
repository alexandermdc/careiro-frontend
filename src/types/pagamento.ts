export interface ItemCarrinho {
  id_produto: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  image: string;
}

export interface PagamentoRequest {
  testeId: string;
}

export interface PagamentoResponse {
  preferenceId: string;
  initPoint: string;
  init_point?: string; // Compatibilidade
}

export interface PedidoComProdutos {
  pedido_id: number;
  data_pedido: string;
  fk_cliente: string;
  fk_feira: number;
  produtos_no_pedido: {
    id_item_pedido: string;
    quantidade: number;
    produto: {
      id_produto: string;
      nome: string;
      preco: number;
      image: string;
    };
  }[];
}
