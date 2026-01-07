import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, FileText, MapPin, Calendar, Upload, X } from 'lucide-react';
import associacaoService from '../../services/associacaoService';
import type { CreateAssociacaoData } from '../../services/associacaoService';
import { useAuth } from '../../contexts/AuthContext';

const CadastroAssociacao: React.FC = () => {
  const navigate = useNavigate();
  useAuth();
  
  const [formData, setFormData] = useState<CreateAssociacaoData>({
    nome: '',
    descricao: '',
    image: '',
    endereco: '',
    data_hora: ''
  });
  
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [imagemError, setImagemError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Debug: Verificar se backend está online
  React.useEffect(() => {
    const testBackend = async () => {
      try {
        await fetch('http://localhost:3000/associacao');

      } catch (error) {

      }
    };
    testBackend();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    
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
    

    if (!formData.nome || !formData.descricao) {
      setError('Nome e descrição são obrigatórios');

      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {

      await associacaoService.create(formData);
      

      
      setSuccess('Associação cadastrada com sucesso!');
      
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        descricao: '',
        image: '',
        endereco: '',
        data_hora: ''
      });
      setImagemPreview('');
      
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
          <Link to="/associacao/cadastro" className="text-[var(--primary-green)] hover:text-[var(--secondary-green)] font-medium flex items-center gap-2">
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
              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem da Associação
                </label>
                <div className="flex items-start gap-4">
                  {/* Preview da imagem */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    {imagemPreview ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={imagemPreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagemPreview('');
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Input de upload */}
                  <div className="flex-1">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-300"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Selecionar Imagem</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Validar tipo
                        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                        if (!validTypes.includes(file.type)) {
                          setImagemError('Formato inválido. Use: JPG, PNG ou WEBP');
                          return;
                        }

                        // Validar tamanho (2MB)
                        if (file.size > 2 * 1024 * 1024) {
                          setImagemError('A imagem deve ter no máximo 2MB');
                          return;
                        }

                        setImagemError('');

                        // Criar preview e converter para base64
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64 = reader.result as string;
                          setImagemPreview(base64);
                          setFormData(prev => ({ ...prev, image: base64 }));
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG ou WEBP até 2MB
                    </p>
                    {imagemError && (
                      <p className="text-xs text-red-600 mt-1">⚠️ {imagemError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Associação *
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
                  Descrição *
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

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco || ''}
                    onChange={handleInputChange}
                    placeholder="Endereço completo da associação"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Data e Hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Hora de Funcionamento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="data_hora"
                    value={formData.data_hora || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: Segunda a Sexta, 8h às 17h"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Informe os horários de funcionamento
                </p>
              </div>

              {/* Vendedor (readonly - usuário logado) */}
              {/* Botões de Ação */}
              <div className="space-y-3">
                {/* Botão Submit Principal */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2D5016] text-white py-4 px-6 rounded-xl hover:bg-[#3a6b1e] focus:ring-4 focus:ring-green-300 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
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
              </div>
            </form> 

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