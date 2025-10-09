import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowLeft, 
  Save,
  DollarSign,
  Tag,
  Image as ImageIcon,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import produtoService from '../../services/produtoService';
import type { CreateProdutoData, Categoria } from '../../services/produtoService';

const CadastroProduto: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<CreateProdutoData>({
    nome: '',
    descricao: '',
    image: '',
    is_promocao: false,
    preco: 0,
    preco_promocao: undefined,
    fk_vendedor: user?.cpf || '', // Assumindo que o vendedor usa CPF como ID
    id_categoria: '',
    disponivel: true,
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const cats = await produtoService.listarCategorias();
      setCategorias(cats);
      
      // Seleciona a primeira categoria por padrão
      if (cats.length > 0) {
        setFormData(prev => ({ ...prev, id_categoria: cats[0].id_categoria }));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'nome':
        if (!value.trim()) {
          newErrors.nome = 'Nome é obrigatório';
        } else {
          delete newErrors.nome;
        }
        break;
      case 'descricao':
        if (!value.trim()) {
          newErrors.descricao = 'Descrição é obrigatória';
        } else {
          delete newErrors.descricao;
        }
        break;
      case 'preco':
        if (value <= 0) {
          newErrors.preco = 'Preço deve ser maior que zero';
        } else {
          delete newErrors.preco;
        }
        break;
      case 'preco_promocao':
        if (formData.is_promocao && (!value || value <= 0)) {
          newErrors.preco_promocao = 'Preço promocional é obrigatório quando em promoção';
        } else if (value && value >= formData.preco) {
          newErrors.preco_promocao = 'Preço promocional deve ser menor que o preço normal';
        } else {
          delete newErrors.preco_promocao;
        }
        break;
      case 'image':
        if (!value.trim()) {
          newErrors.image = 'URL da imagem é obrigatória';
        } else {
          delete newErrors.image;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof CreateProdutoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os campos
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field as keyof CreateProdutoData]);
    });

    if (Object.keys(errors).length > 0) {
      console.log('❌ Formulário com erros:', errors);
      return;
    }

    try {
      setLoading(true);
      console.log('📤 Enviando produto:', formData);
      
      const produtoCriado = await produtoService.criar(formData);
      
      console.log('✅ Produto criado:', produtoCriado);
      
      // Toast de sucesso
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform translate-x-full transition-transform duration-300';
      successToast.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="bg-white/20 p-1 rounded-full">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold">Produto cadastrado!</p>
            <p class="text-sm opacity-90">${produtoCriado.nome} foi criado com sucesso</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        successToast.classList.remove('translate-x-full');
      }, 100);
      
      setTimeout(() => {
        successToast.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(successToast)) {
            document.body.removeChild(successToast);
          }
        }, 300);
      }, 3000);
      
      // Redirecionar para lista de produtos após 2 segundos
      setTimeout(() => {
        navigate('/produtos');
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ Erro ao cadastrar produto:', err);
      
      // Toast de erro
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform translate-x-full transition-transform duration-300';
      errorToast.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="bg-white/20 p-1 rounded-full">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold">Erro ao cadastrar</p>
            <p class="text-sm opacity-90">${err.message || 'Tente novamente'}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        errorToast.classList.remove('translate-x-full');
      }, 100);
      
      setTimeout(() => {
        errorToast.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(errorToast)) {
            document.body.removeChild(errorToast);
          }
        }, 300);
      }, 5000);
      
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.nome.trim() && 
           formData.descricao.trim() && 
           formData.image.trim() &&
           formData.preco > 0 &&
           formData.id_categoria &&
           Object.keys(errors).length === 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para cadastrar produtos</p>
          <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/produtos" 
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900">
              <Package className="inline w-6 h-6 mr-2" />
              Cadastrar Produto
            </h1>
            
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* Informações Básicas */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Informações Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Tomate Orgânico"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                    errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  disabled={loading}
                />
                {errors.nome && (
                  <p className="text-red-600 text-sm mt-1">⚠️ {errors.nome}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva seu produto..."
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                    errors.descricao ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  disabled={loading}
                />
                {errors.descricao && (
                  <p className="text-red-600 text-sm mt-1">⚠️ {errors.descricao}</p>
                )}
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Categoria *
                </label>
                <select
                  value={formData.id_categoria}
                  onChange={(e) => handleInputChange('id_categoria', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                  disabled={loading}
                >
                  {categorias.map(cat => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disponível */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Disponibilidade
                </label>
                <select
                  value={formData.disponivel ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('disponivel', e.target.value === 'true')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                  disabled={loading}
                >
                  <option value="true">Disponível</option>
                  <option value="false">Indisponível</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preços */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Preços
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preço */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                    errors.preco ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  disabled={loading}
                />
                {errors.preco && (
                  <p className="text-red-600 text-sm mt-1">⚠️ {errors.preco}</p>
                )}
              </div>

              {/* Promoção */}
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.is_promocao}
                    onChange={(e) => handleInputChange('is_promocao', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    disabled={loading}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Produto em Promoção
                  </span>
                </label>

                {formData.is_promocao && (
                  <>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preço Promocional (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco_promocao || ''}
                      onChange={(e) => handleInputChange('preco_promocao', parseFloat(e.target.value) || undefined)}
                      placeholder="0.00"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                        errors.preco_promocao ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      disabled={loading}
                    />
                    {errors.preco_promocao && (
                      <p className="text-red-600 text-sm mt-1">⚠️ {errors.preco_promocao}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              Imagem do Produto
            </h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL da Imagem *
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                  errors.image ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={loading}
              />
              {errors.image && (
                <p className="text-red-600 text-sm mt-1">⚠️ {errors.image}</p>
              )}
              
              {formData.image && !errors.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-48 h-48 object-cover rounded-xl border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/192x192/f0f0f0/999?text=Imagem+Inválida';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/produtos')}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="flex-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-800 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Cadastrando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Cadastrar Produto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroProduto;
