import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginTeste() {
  const [email, setEmail] = useState('teste@agriconect.com');
  const navigate = useNavigate();

  const handleLoginSimulado = () => {
    // Simular token JWT (em produção viria do backend)
    const tokenFake = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQGFncmljb25lY3QuY29tIiwiaWF0IjoxNjk5ODg4ODg4fQ.fake-token-para-teste';
    
    localStorage.setItem('token', tokenFake);
    localStorage.setItem('userEmail', email);
    
    alert(`✅ Login simulado com sucesso!\n\nEmail: ${email}`);
    navigate('/produtos-teste');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Login de Teste</h1>
          <p className="text-gray-600">Para testar o fluxo de pagamento</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email de Teste
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <button
            onClick={handleLoginSimulado}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Entrar (Simulado)
          </button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Atenção:</strong> Este é um login simulado apenas para testes.
              <br /><br />
              O token gerado é falso. Para usar a API real do Mercado Pago, você precisa:
              <br />
              1. Fazer login real com usuário cadastrado
              <br />
              2. Obter token JWT válido do backend
            </p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Ir para Login Real →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
