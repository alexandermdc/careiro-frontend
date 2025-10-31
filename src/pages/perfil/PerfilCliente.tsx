import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Package, 
  Heart, 
  Star,
  ArrowLeft,
  LogOut,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clienteService from '../../services/clienteService';
import type { Cliente, Produto, UpdateClienteData } from '../../services/clienteService';

// Componente Modal
const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onSave: (data: UpdateClienteData) => Promise<void>;
}> = ({ isOpen, onClose, cliente, onSave }) => {
  const [editData, setEditData] = useState<UpdateClienteData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (cliente && isOpen) {
      setEditData({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone
      });
      setErrors({});
    }
  }, [cliente, isOpen]);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'nome':
        if (!value.trim()) {
          newErrors.nome = 'Nome é obrigatório';
        } else {
          delete newErrors.nome;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'telefone':
        if (!value.trim()) {
          newErrors.telefone = 'Telefone é obrigatório';
        } else {
          delete newErrors.telefone;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'telefone') {
      // Formatar telefone automaticamente
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 11) {
        formattedValue = formattedValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (formattedValue.length >= 7) {
        formattedValue = formattedValue.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (formattedValue.length >= 3) {
        formattedValue = formattedValue.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      }
      setEditData(prev => ({ ...prev, [field]: formattedValue }));
      validateField(field, formattedValue);
    } else {
      setEditData(prev => ({ ...prev, [field]: value }));
      validateField(field, value);
    }
  };

  const handleSave = async () => {
    // Validar todos os campos
    const fieldsToValidate = ['nome', 'email', 'telefone'];
    fieldsToValidate.forEach(field => {
      validateField(field, editData[field as keyof UpdateClienteData] || '');
    });

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await onSave(editData);
      onClose();
    } catch (error) {
      console.error('Erro no modal:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return editData.nome?.trim() && 
           editData.email?.trim() && 
           editData.telefone?.trim() &&
           Object.keys(errors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Editar Perfil</h2>
                <p className="text-white/80 text-sm">Atualize suas informações pessoais</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nome Completo *
            </label>
            <input
              type="text"
              value={editData.nome || ''}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Digite seu nome completo"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={loading}
            />
            {errors.nome && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span className="w-4 h-4 text-red-500">⚠️</span>
                {errors.nome}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              value={editData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Digite seu email"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span className="w-4 h-4 text-red-500">⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefone *
            </label>
            <input
              type="tel"
              value={editData.telefone || ''}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              placeholder="(84) 99999-9999"
              maxLength={15}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                errors.telefone ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={loading}
            />
            {errors.telefone && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span className="w-4 h-4 text-red-500">⚠️</span>
                {errors.telefone}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Digite apenas números, será formatado automaticamente
            </p>
          </div>

          {/* CPF (apenas visualização, mascarado) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              CPF
            </label>
            <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-600">
              {cliente?.cpf ? `***.***.***-${cliente.cpf.slice(-2)}` : '***.***.***-**'}
            </div>
            <p className="text-gray-500 text-xs mt-1">
              🔒 CPF ocultado por segurança e não pode ser alterado
            </p>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !isFormValid()}
              className="flex-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-800 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            * Campos obrigatórios
          </p>
        </div>
      </div>
    </div>
  );
};

const PerfilCliente: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('pedidos');
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [favoritos, setFavoritos] = useState<Produto[]>([]);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  console.log('🎯 Componente PerfilCliente renderizado');
  console.log('👤 Usuário do contexto:', user);

  useEffect(() => {
    if (user?.cpf) {
      carregarDadosCompletos();
    }
  }, [user]);

  const carregarDadosCompletos = async () => {
    if (!user?.cpf) return;
    
    try {
      console.log('🔄 Carregando dados completos do cliente...');
      setLoading(true);
      setError('');
      
      const dadosCompletos = await clienteService.buscarPerfilCompleto(user.cpf);
      
      setCliente(dadosCompletos.cliente);
      setFavoritos(dadosCompletos.favoritos);
      
      console.log('✅ Dados carregados:', {
        cliente: dadosCompletos.cliente.nome,
        favoritos: dadosCompletos.favoritos.length
      });
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (editData: UpdateClienteData) => {
    if (!user?.cpf) return;
    
    try {
      console.log('💾 Salvando alterações via modal...');
      console.log('📋 Dados para atualização:', editData);
      
      const clienteAtualizado = await clienteService.atualizar(user.cpf, editData);
      
      setCliente(clienteAtualizado);
      
      console.log('✅ Perfil atualizado com sucesso via modal');
      
      // Notification toast moderna
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
            <p class="font-semibold">Perfil atualizado!</p>
            <p class="text-sm opacity-90">Suas informações foram salvas com sucesso</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(successToast);
      
      // Animate in
      setTimeout(() => {
        successToast.classList.remove('translate-x-full');
      }, 100);
      
      // Animate out and remove
      setTimeout(() => {
        successToast.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(successToast)) {
            document.body.removeChild(successToast);
          }
        }, 300);
      }, 4000);
      
    } catch (err: any) {
      console.error('❌ Erro ao atualizar perfil via modal:', err);
      
      // Error toast
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
            <p class="font-semibold">Erro ao salvar</p>
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
      
      throw err; // Re-throw para o modal tratar
    }
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para ver o perfil</p>
          <Link to="/login" className="bg-green-500 text-white px-6 py-2 rounded-lg">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Erro ao Carregar Perfil</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={carregarDadosCompletos}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tentar Novamente
            </button>
            <Link 
              to="/" 
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-green-500 hover:text-green-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Início
            </Link>
            
            <div className="flex items-center gap-4">
                            <button 
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Edit3 className="w-4 h-4" />
                Editar Perfil
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Dados Pessoais */}
          <div className="lg:col-span-1">
            {/* Estatísticas */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">
                Estatísticas
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">0</div>
                  <div className="text-sm text-gray-600">Pedidos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{favoritos.length}</div>
                  <div className="text-sm text-gray-600">Favoritos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">0</div>
                  <div className="text-sm text-gray-600">Assinaturas</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {cliente?.nome || user.nome}
                </h2>
                <p className="text-gray-600">Cliente Agriconect</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">
                  Dados pessoais
                </h3>
                
                {/* Nome */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <p className="text-gray-900 font-medium">{cliente?.nome}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-gray-900 font-medium">{cliente?.email}</p>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <p className="text-gray-900 font-medium">{cliente?.telefone}</p>
                  </div>
                </div>

                {/* CPF (oculto por segurança) */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      CPF
                    </label>
                    <p className="text-gray-900 font-medium">
                      {cliente?.cpf ? `***.***.***-${cliente.cpf.slice(-2)}` : '***.***.***-**'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      🔒 Oculto por segurança
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Lateral */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('pedidos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'pedidos' 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Pedidos
                </button>
                
                <button
                  onClick={() => setActiveTab('favoritos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'favoritos' 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Favoritos ({favoritos.length})
                </button>

                <button
                  onClick={() => setActiveTab('assinaturas')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'assinaturas' 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Star className="w-5 h-5" />
                  Assinaturas
                </button>
              </nav>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {activeTab === 'pedidos' && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h3>
                <p className="text-gray-600 mb-6">
                  Quando você fizer pedidos, eles aparecerão aqui
                </p>
                <Link 
                  to="/produtos" 
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Explorar Produtos
                </Link>
              </div>
            )}

            {activeTab === 'favoritos' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    Produtos Favoritos ({favoritos.length})
                  </h3>
                </div>
                
                {favoritos.length === 0 ? (
                  <div className="p-8 text-center">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum favorito ainda</h3>
                    <p className="text-gray-600 mb-6">
                      Adicione produtos aos seus favoritos para vê-los aqui
                    </p>
                    <Link 
                      to="/produtos" 
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Explorar Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoritos.map((produto) => (
                        <div key={produto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={produto.imagem || 'https://via.placeholder.com/64x64/f0f0f0/999?text=Produto'} 
                                alt={produto.nome}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {produto.nome}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">
                                {produto.descricao}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-green-500">
                                  R$ {produto.preco.toFixed(2)}
                                </span>
                                <button className="text-green-500 hover:text-green-700 text-sm font-medium">
                                  Ver produto
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assinaturas' && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma assinatura ativa</h3>
                <p className="text-gray-600 mb-6">
                  Assine produtos e receba-os regularmente com desconto
                </p>
                <Link 
                  to="/assinaturas" 
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ver Planos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal de Edição */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        cliente={cliente}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default PerfilCliente;