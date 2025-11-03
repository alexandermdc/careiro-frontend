import api from './api';
import type { PagamentoResponse } from '../types/pagamento';

interface ItemPagamento {
  id_produto: string | number;
  quantidade: number;
}

interface CriarPagamentoDireto {
  testeId: string;
  itens: ItemPagamento[];
  valorTotal: number;
}

class PagamentoService {
  /**
   * Cria uma preferência de pagamento com pedido já existente no banco
   * @param pedidoId - ID do pedido criado no banco
   * @returns Preference ID e URL de checkout
   */
  async criarPreferencia(pedidoId: number): Promise<PagamentoResponse> {
    try {
      console.log(`💳 Criando preferência para pedido #${pedidoId}...`);
      
      // Backend vai buscar os produtos do banco usando o pedido_id
      const response = await api.post<PagamentoResponse>('/mercadopago/pagamento', {
        pedido_id: pedidoId
      });

      console.log('✅ Preferência criada:', response.data);
      
      // Compatibilidade com diferentes formatos de resposta
      return {
        preferenceId: response.data.preferenceId,
        initPoint: response.data.initPoint || response.data.init_point || '',
      };
    } catch (error: any) {
      console.error('❌ Erro ao criar preferência:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Erro ao criar pagamento');
    }
  }

  /**
   * Cria uma preferência de pagamento diretamente com os itens do carrinho
   * @param dados - Dados do carrinho (testeId, itens, valor total)
   * @returns URL de redirecionamento do Mercado Pago
   */
  async criarPagamentoDireto(dados: CriarPagamentoDireto): Promise<string> {
    try {
      console.log('💳 Criando pagamento no Mercado Pago...');
      console.log('📦 Dados:', dados);

      const response = await api.post<{ initPoint?: string; init_point?: string }>(
        '/mercadopago/pagamento',
        dados
      );

      console.log('✅ Resposta do Mercado Pago:', response.data);

      // O backend pode retornar initPoint ou init_point
      const initPoint = response.data.initPoint || response.data.init_point;

      if (!initPoint) {
        throw new Error('Link de pagamento não foi gerado pelo backend');
      }

      return initPoint;
    } catch (error: any) {
      console.error('❌ Erro ao criar pagamento:', error);
      console.error('📋 Detalhes:', error.response?.data);

      // Tratamento de erros específicos
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const mensagemErro = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Erro desconhecido ao processar pagamento';

      throw new Error(mensagemErro);
    }
  }

  /**
   * Gera um ID único para o pedido
   * @returns ID único no formato pedido-{timestamp}-{random}
   */
  gerarIdPedido(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `pedido-${timestamp}-${random}`;
  }

  /**
   * Redireciona para o checkout do Mercado Pago
   * @param initPoint - URL do checkout retornada pela API
   */
  redirecionarParaCheckout(initPoint: string): void {
    if (!initPoint) {
      throw new Error('URL de checkout inválida');
    }
    console.log('🚀 Redirecionando para Mercado Pago:', initPoint);
    window.location.href = initPoint;
  }
}

export default new PagamentoService();
