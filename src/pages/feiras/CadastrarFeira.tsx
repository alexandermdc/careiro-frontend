import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Store } from 'lucide-react';
import feiraService, { type CreateFeiraData } from '../../services/feiraService';
import { useAuth } from '../../contexts/AuthContext';
import ImageUpload from '../../components/ImageUpload';

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
    image: '',
    data_hora: '',
    descricao: '',
    localizacao: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [imagePreview, setImagePreview] = useState<string>('');

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
      case 'data_hora':
        if (value && new Date(value) < new Date()) {
          newErrors.data_hora = 'A data não pode ser no passado';
        } else {
          delete newErrors.data_hora;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof CreateFeiraData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string') {
      validateField(field, value);
    }
    setErro(''); // Limpa erro geral ao digitar
  };

  const handleImageError = (error: string) => {
    setErrors(prev => ({ ...prev, image: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os campos obrigatórios
    validateField('nome', formData.nome);
    if (formData.data_hora) {
      validateField('data_hora', formData.data_hora);
    }
    
    // Verificar se há erros
    if (Object.keys(errors).length > 0 || !formData.nome.trim()) {
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

              {/* Data e Hora */}
              <div>
                <label htmlFor="data_hora" className="block text-sm font-semibold text-gray-700 mb-2">
                  Data e Hora
                </label>
                <input
                  type="text"
                  id="data_hora"
                  value={formData.data_hora}
                  onChange={(e) => handleInputChange('data_hora', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex: Sábado, 10/01/2026 às 06:00"
                  disabled={loading || sucesso}
                />
              </div>

              {/* Localização */}
              <div>
                <label htmlFor="localizacao" className="block text-sm font-semibold text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  id="localizacao"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex: Praça Central, Centro"
                  disabled={loading || sucesso}
                />
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagem da Feira
                </label>
                <ImageUpload
                  value={formData.image || ''}
                  onChange={(file) => handleInputChange('image', file)}
                  onError={handleImageError}
                  preview={imagePreview}
                  onPreviewChange={setImagePreview}
                  disabled={loading || sucesso}
                  error={errors.image}
                />
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Descreva a feira, produtos disponíveis, horários, etc."
                  disabled={loading || sucesso}
                />
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
            <li>• Apenas o <span className="font-semibold">Nome</span> é obrigatório</li>
            <li>• A <span className="font-semibold">Data/Hora</span> é um campo de texto livre</li>
            <li>• A <span className="font-semibold">Localização</span> ajuda os clientes a encontrarem a feira</li>
            <li>• A <span className="font-semibold">Imagem</span> será enviada direto para o servidor (máx 2MB)</li>
            <li>• A <span className="font-semibold">Descrição</span> ajuda os clientes a conhecerem melhor a feira</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CadastrarFeira;
