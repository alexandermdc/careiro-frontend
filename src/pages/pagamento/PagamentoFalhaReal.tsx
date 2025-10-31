import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PagamentoFalhaReal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Pagamento Não Aprovado
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Infelizmente seu pagamento não pôde ser processado.
          </p>

          {/* Detalhes */}
          {(status || paymentId) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-red-800 mb-3">Informações</h2>
              <div className="space-y-2 text-left text-gray-700">
                {status && <p><strong>Status:</strong> {status}</p>}
                {paymentId && <p><strong>ID do Pagamento:</strong> {paymentId}</p>}
              </div>
            </div>
          )}

          {/* Possíveis Motivos */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-yellow-800 mb-3">Possíveis motivos:</h2>
            <ul className="text-left text-gray-700 space-y-2">
              <li>💳 Cartão sem saldo suficiente</li>
              <li>🔒 Dados do cartão incorretos</li>
              <li>⚠️ Problema com a operadora</li>
              <li>🚫 Pagamento recusado pelo banco</li>
            </ul>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </div>
  );
}
