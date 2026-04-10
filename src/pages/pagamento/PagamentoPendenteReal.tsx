import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function PagamentoPendenteReal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const pedidoId = searchParams.get('pedido_id');

  useEffect(() => {
    const carregarPedido = async () => {
      const id = pedidoId || localStorage.getItem('ultimo_pedido_id');

      if (id) {
        try {
          const response = await api.get(`/pedido/${id}`);
          setPedido(response.data);
        } catch (error) {
          console.error('❌ Erro ao carregar pedido:', error);
        }
      }

      setLoading(false);
    };

    carregarPedido();
  }, [pedidoId, paymentId, status]);

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-8xl mb-6">⏳</div>
          <h1 className="text-4xl font-bold text-yellow-600 mb-4">
            Pagamento Pendente
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Seu pagamento está sendo processado.
          </p>

          {/* Detalhes do Pagamento */}
          {paymentId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-yellow-800 mb-3">Detalhes do Pagamento</h2>
              <div className="space-y-2 text-left text-gray-700">
                <p><strong>ID do Pagamento:</strong> {paymentId}</p>
                <p><strong>Status:</strong> {status || 'pending'}</p>
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
                {(pedido.associacao_retirada || pedido.retirada_local) && (
                  <>
                    <p>
                      <strong>Retirada:</strong>{' '}
                      {pedido.associacao_retirada?.nome || pedido.retirada_local}
                    </p>
                    {(pedido.associacao_retirada?.endereco || pedido.associacao_retirada?.data_hora) && (
                      <p>
                        <strong>Local/Horário:</strong>{' '}
                        {pedido.associacao_retirada?.endereco || 'Endereço não informado'}
                        {pedido.associacao_retirada?.data_hora ? ` • ${pedido.associacao_retirada.data_hora}` : ''}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Informações */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-800 mb-3">O que significa?</h2>
            <ul className="text-left text-gray-700 space-y-2">
              <li>🏦 Pagamento em boleto ou PIX aguardando confirmação</li>
              <li>⏱️ Pode levar até 48h para processar</li>
              <li>📧 Você receberá um email quando for aprovado</li>
              <li>📱 Acompanhe o status na área de pedidos</li>
            </ul>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/pedidos')}
              className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold"
            >
              Ver Meus Pedidos
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
