import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, FileText } from 'lucide-react';
import associacaoService from '../../services/associacaoService';
import type { CreateAssociacaoData } from '../../services/associacaoService';
import { useAuth } from '../../contexts/AuthContext';

const CadastroAssociacao: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CreateAssociacaoData>({
    nome: '',
    descricao: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  console.log('🎯 Componente CadastroAssociacao renderizado');
  console.log('👤 Usuário atual:', user);
  console.log('📋 FormData inicial:', formData);
  
  // Debug: Verificar se backend está online
  React.useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:3000/associacao');
        console.log('🌐 Backend Status:', response.status, response.statusText);
      } catch (error) {
        console.error('❌ Backend offline ou erro:', error);
      }
    };
    testBackend();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`📝 Campo alterado - ${name}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagens de erro/sucesso ao digitar
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando cadastro de associação...');
    console.log('📋 Dados do formulário:', formData);
    
    if (!formData.nome || !formData.descricao) {
      setError('Nome e descrição são obrigatórios');
      console.log('❌ Erro: Campos obrigatórios não preenchidos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('⏳ Enviando dados para o backend...'); 
      console.log('📊 FormData completo:', JSON.stringify(formData, null, 2));
      console.log('👤 Usuário logado:', JSON.stringify(user, null, 2));
      
      const result = await associacaoService.create(formData);
      
      console.log('✅ Associação criada com sucesso:', result);
      
      setSuccess('Associação cadastrada com sucesso!');
      
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        descricao: ''
      });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/associacao');
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ Erro no cadastro:', err);
      setError(err.message || 'Erro ao cadastrar associação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header Simples */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/associacao" className="text-[var(--primary-green)] hover:text-[var(--secondary-green)] font-medium flex items-center gap-2">
            ← Voltar para Associações
          </Link>
        </div>
      </div>
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Seção da Imagem - 70% */}
        <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-green)] to-[var(--secondary-green)] opacity-90"></div>
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=2073&auto=format&fit=crop')"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Building2 className="w-24 h-24 mx-auto mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                  Cadastre sua Associação
                </h2>
                <p className="text-xl opacity-90 max-w-md">
                  Conecte sua associação ao Agriconect e amplie seu alcance no mercado agrícola
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção do Formulário - 30% */}
        <div className="w-full lg:w-[30%] flex items-center justify-center p-8 lg:p-12 bg-white shadow-xl">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-[var(--primary-green)]" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] bg-clip-text text-transparent mb-3">
                Nova Associação
              </h2>
              <p className="text-gray-600 text-lg">
                Preencha os dados para cadastrar sua associação
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Associação
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Nome da associação"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva a associação, seus objetivos e atividades..."
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>
              </div>

              {/* Vendedor (readonly - usuário logado) */}
              {/* Botões de Ação */}
              <div className="space-y-3">
                {/* Botão Submit Principal */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] text-white py-4 px-6 rounded-xl hover:from-[var(--secondary-green)] hover:to-[var(--primary-green)] focus:ring-4 focus:ring-green-200 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span className="text-lg">Cadastrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <span className="text-lg">Cadastrar Associação</span>
                    </div>
                  )}
                </button>

                {/* Botões de Teste */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      console.log('🧪 TESTE: Verificando GET /associacao...');
                      try {
                        const response = await fetch('http://localhost:3000/associacao');
                        const data = await response.json();
                        console.log('✅ GET OK:', { status: response.status, data });
                        alert(`GET OK! Status: ${response.status}`);
                      } catch (error) {
                        console.error('❌ GET Error:', error);
                        alert('Erro no GET!');
                      }
                    }}
                    className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-xs"
                  >
                    🔍 Testar GET
                  </button>
                  
                  <button
                    type="button"
                    onClick={async () => {
                      console.log('🧪 TESTE: Verificando POST /associacao/cadastro...');
                      const testData = {
                        id_associacao: 'TEST-001',
                        nome: 'Teste Associação',
                        descricao: 'Descrição de teste',
                        vendedor: user?.email || 'test@test.com'
                      };
                      
                      try {
                        const response = await fetch('http://localhost:3000/associacao/cadastro', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                          },
                          body: JSON.stringify(testData)
                        });
                        
                        const result = await response.text();
                        console.log('📤 POST Result:', { 
                          status: response.status, 
                          statusText: response.statusText,
                          result 
                        });
                        
                        if (response.ok) {
                          alert(`POST OK! Status: ${response.status}`);
                        } else {
                          alert(`POST Erro! Status: ${response.status} - ${result}`);
                        }
                      } catch (error) {
                        console.error('❌ POST Error:', error);
                        alert('Erro no POST!');
                      }
                    }}
                    className="bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors text-xs"
                  >
                    📤 Testar POST
                  </button>
                </div>
              </div>
            </form>

            {/* Debug Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🐛 Debug Info:</h4>
              <div className="text-sm text-blue-600 space-y-1">
                <p><strong>User Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>User Nome:</strong> {user?.nome || 'N/A'}</p>
                <p><strong>User CPF:</strong> {user?.cpf || 'N/A'}</p>
                <p><strong>Form Data:</strong></p>
                <pre className="bg-blue-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
                <p><strong>Token Present:</strong> {localStorage.getItem('accessToken') ? '✅ Sim' : '❌ Não'}</p>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <Link 
                to="/associacao" 
                className="text-[var(--primary-green)] hover:text-[var(--secondary-green)] font-medium transition-colors"
              >
                ← Voltar para lista de associações
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroAssociacao;