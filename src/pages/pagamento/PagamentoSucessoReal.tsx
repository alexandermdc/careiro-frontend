import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function PagamentoSucessoReal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const preferenceId = searchParams.get('preference_id');

  useEffect(() => {
    const carregarPedido = async () => {
      const pedidoId = localStorage.getItem('ultimo_pedido_id');

      console.log('🔄 Retorno do Mercado Pago:', {
        paymentId,
        status,
        preferenceId,
        pedidoId
      });

      if (pedidoId) {
        try {
          const response = await api.get(`/pedido/${pedidoId}`);
          setPedido(response.data);
          console.log('✅ Pedido carregado:', response.data);

          // Limpar carrinho e pedido salvo
          localStorage.removeItem('carrinho');
          localStorage.removeItem('ultimo_pedido_id');
        } catch (error) {
          console.error('❌ Erro ao carregar pedido:', error);
        }
      }

      setLoading(false);
    };

    carregarPedido();
  }, [paymentId, status, preferenceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Pagamento Aprovado!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Seu pagamento foi processado com sucesso.
          </p>

          {/* Detalhes do Pagamento */}
          {paymentId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-green-800 mb-3">Detalhes do Pagamento</h2>
              <div className="space-y-2 text-left text-gray-700">
                <p><strong>ID do Pagamento:</strong> {paymentId}</p>
                <p><strong>Status:</strong> {status || 'approved'}</p>
                {preferenceId && <p><strong>Preferência:</strong> {preferenceId}</p>}
              </div>
            </div>
          )}

          {/* Detalhes do Pedido */}
          {pedido && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-blue-800 mb-3">Detalhes do Pedido</h2>
              <div className="space-y-2 text-left text-gray-700">
                <p><strong>Número do Pedido:</strong> #{pedido.pedido_id}</p>
                <p><strong>Data:</strong> {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</p>
                {pedido.produtos_no_pedido && (
                  <p><strong>Itens:</strong> {pedido.produtos_no_pedido.length} produtos</p>
                )}
              </div>
            </div>
          )}

          {/* Próximos Passos */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-800 mb-3">Próximos passos:</h2>
            <ul className="text-left text-gray-700 space-y-2">
              <li>✓ Você receberá um email de confirmação</li>
              <li>✓ Seu pedido está sendo preparado</li>
              <li>✓ Acompanhe o status na área de pedidos</li>
            </ul>
          </div>

          {/* Ações */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/produtos')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Continuar Comprando
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Ir para Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
