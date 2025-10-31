import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PagamentoRetorno() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure' | 'pending'>('loading');

  useEffect(() => {
    // Pegar status da URL
    const statusParam = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');
    const preferenceId = searchParams.get('preference_id');
    const externalReference = searchParams.get('external_reference');

    console.log('🔄 Retorno do Mercado Pago:', {
      status: statusParam,
      paymentId,
      preferenceId,
      externalReference
    });

    if (statusParam === 'sucesso' || statusParam === 'approved') {
      setStatus('success');
    } else if (statusParam === 'falha' || statusParam === 'failure') {
      setStatus('failure');
    } else if (statusParam === 'pending') {
      setStatus('pending');
    } else {
      setStatus('loading');
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">✅</div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Pagamento Aprovado!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Seu pagamento foi processado com sucesso.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-green-800 mb-2">Próximos passos:</h2>
              <ul className="text-left text-gray-700 space-y-2">
                <li>✓ Você receberá um email de confirmação</li>
                <li>✓ Seu pedido está sendo preparado</li>
                <li>✓ Acompanhe o status na área de pedidos</li>
              </ul>
            </div>
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
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">⏳</div>
            <h1 className="text-4xl font-bold text-yellow-600 mb-4">
              Pagamento Pendente
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Seu pagamento está sendo processado.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-yellow-800 mb-2">O que isso significa?</h2>
              <ul className="text-left text-gray-700 space-y-2">
                <li>⏳ O pagamento está em análise</li>
                <li>📧 Você receberá um email quando for aprovado</li>
                <li>⚠️ Pode levar até 2 dias úteis</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold"
            >
              Voltar ao Início
            </button>
          </div>
        );

      case 'failure':
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">❌</div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Pagamento Recusado
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Não foi possível processar seu pagamento.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-red-800 mb-2">Possíveis motivos:</h2>
              <ul className="text-left text-gray-700 space-y-2">
                <li>💳 Cartão sem saldo suficiente</li>
                <li>🔒 Dados incorretos</li>
                <li>⚠️ Problema com a operadora</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/carrinho')}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">⏳</div>
            <h1 className="text-4xl font-bold text-gray-600 mb-4">
              Processando...
            </h1>
            <p className="text-xl text-gray-600">
              Aguarde enquanto verificamos seu pagamento.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full">
        {renderContent()}
      </div>
    </div>
  );
}
