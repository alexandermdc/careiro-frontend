import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Store } from 'lucide-react';
import feiraService, { type CreateFeiraData } from '../../services/feiraService';
import { useAuth } from '../../contexts/AuthContext';

const CadastrarFeira: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Verificar se é admin
  useEffect(() => {
    if (!user) {
      alert('⚠️ Você precisa estar logado como administrador para cadastrar feiras!');
      navigate('/login');
      return;
    }
    
    if (user.tipo !== 'ADMIN') {
      alert('⚠️ Apenas administradores podem cadastrar feiras!');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState<CreateFeiraData>({
    nome: '',
    endereco: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'nome':
        if (!value.trim()) {
          newErrors.nome = 'Nome da feira é obrigatório';
        } else if (value.trim().length < 3) {
          newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
        } else {
          delete newErrors.nome;
        }
        break;
      case 'endereco':
        if (!value.trim()) {
          newErrors.endereco = 'Endereço é obrigatório';
        } else if (value.trim().length < 5) {
          newErrors.endereco = 'Endereço deve ter no mínimo 5 caracteres';
        } else {
          delete newErrors.endereco;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof CreateFeiraData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
    setErro(''); // Limpa erro geral ao digitar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os campos
    validateField('nome', formData.nome);
    validateField('endereco', formData.endereco);
    
    // Verificar se há erros
    if (Object.keys(errors).length > 0 || !formData.nome.trim() || !formData.endereco.trim()) {
      setErro('Por favor, corrija os erros no formulário');
      return;
    }
    
    setLoading(true);
    setErro('');
    setSucesso(false);
    
    try {
      await feiraService.criar(formData);
      
      setSucesso(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/feiras');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro ao cadastrar feira:', error);
      setErro(error.message || 'Erro ao cadastrar feira. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/feiras" 
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para Feiras
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Cadastrar Nova Feira</h1>
                <p className="text-green-100 mt-2">Preencha os dados para criar uma nova feira</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Mensagens de Erro/Sucesso */}
            {erro && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">❌ {erro}</p>
              </div>
            )}

            {sucesso && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">✅ Feira cadastrada com sucesso! Redirecionando...</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Nome da Feira */}
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Feira <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  onBlur={(e) => validateField('nome', e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    errors.nome ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  placeholder="Ex: Feira da Matriz"
                  disabled={loading || sucesso}
                />
                {errors.nome && (
                  <p className="mt-2 text-sm text-red-600">{errors.nome}</p>
                )}
              </div>

              {/* Endereço */}
              <div>
                <label htmlFor="endereco" className="block text-sm font-semibold text-gray-700 mb-2">
                  Endereço <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  onBlur={(e) => validateField('endereco', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border ${
                    errors.endereco ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none`}
                  placeholder="Ex: Rua Principal, Centro - Careiro da Várzea, AM"
                  disabled={loading || sucesso}
                />
                {errors.endereco && (
                  <p className="mt-2 text-sm text-red-600">{errors.endereco}</p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading || sucesso}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Cadastrar Feira
                  </>
                )}
              </button>

              <Link
                to="/feiras"
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informações Importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Todos os campos marcados com <span className="text-red-500">*</span> são obrigatórios</li>
            <li>• O nome da feira deve ser único e descritivo</li>
            <li>• Forneça um endereço completo e preciso para facilitar a localização</li>
            <li>• Após o cadastro, a feira estará disponível para visualização</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CadastrarFeira;
