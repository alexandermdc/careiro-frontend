/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
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
  X,
  ShoppingBag,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import clienteService from '../../services/clienteService';
import pedidoService from '../../services/pedidoService';
import vendedorService from '../../services/vendedorService';
import type { Cliente, UpdateClienteData } from '../../services/clienteService';
import type { Pedido } from '../../services/pedidoService';
import type { Vendedor, UpdateVendedorData } from '../../services/vendedorService';
import { HeaderSection } from '../../components';
import { FooterSection } from '../../components';
import Modal from '../../components/Modal';

// Componente Modal de Detalhes do Pedido
const PedidoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}> = ({ isOpen, onClose, pedido }) => {
  if (!pedido) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pedido #${pedido.pedido_id}`}
      maxWidth="2xl"
      footerContent={
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
        >
          Fechar
        </button>
      }
    >
      <div className="space-y-6">
        {/* Data do pedido */}
        <div className="text-sm text-gray-600">
          📅 {new Date(pedido.data_pedido).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })} às {new Date(pedido.data_pedido).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">Status do Pedido</p>
            <p className="text-lg font-bold text-green-700">✓ Confirmado</p>
          </div>
          <span className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold">
            Ativo
          </span>
        </div>

        {/* Informações da Feira */}
        {pedido.feira && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Informações da Feira
            </h3>
            <div className="space-y-2">
              <p className="text-gray-900">
                <strong>Nome:</strong> {pedido.feira.nome || `Feira #${pedido.fk_feira}`}
              </p>
              {pedido.feira.local && (
                <p className="text-gray-700">
                  <strong>📍 Local:</strong> {pedido.feira.local}
                </p>
              )}
              {pedido.feira.data_feira && (
                <p className="text-gray-700">
                  <strong>🗓️ Data de Retirada:</strong> {new Date(pedido.feira.data_feira).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long'
                  })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Lista de Produtos */}
        {pedido.produtos_no_pedido && pedido.produtos_no_pedido.length > 0 ? (
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Produtos ({pedido.produtos_no_pedido.length})
            </h3>
            <div className="space-y-4">
              {pedido.produtos_no_pedido.map((item: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all"
                >
                  {/* Imagem do Produto */}
                  <div className="flex-shrink-0">
                    {item.produto?.image ? (
                      <img 
                        src={item.produto.image}
                        alt={item.produto.nome}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded-xl flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Informações do Produto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-xl mb-2">
                      {item.produto?.nome || 'Produto'}
                    </h4>
                    
                    {item.produto?.descricao && (
                      <p className="text-sm text-gray-600 mb-3">
                        {item.produto.descricao}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Quantidade:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">
                          {item.quantidade} {item.produto?.unidade_medida || 'un'}
                        </span>
                      </div>
                      
                      {item.produto?.preco && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Preço Unit.:</span>
                          <span className="text-green-600 font-bold">
                            R$ {item.produto.preco.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.produto?.categoria && (
                      <div className="mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {item.produto.categoria.nome || item.produto.categoria}
                        </span>
                      </div>
                    )}

                    {item.produto?.vendedor && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          👨‍🌾 <strong>Vendedor:</strong> {item.produto.vendedor.nome || 'Agricultor'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preço Total do Item */}
                  {item.produto?.preco && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                      <p className="text-3xl font-bold text-green-600">
                        R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total do Pedido */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valor Total do Pedido</p>
                  <p className="text-base text-gray-700">
                    {pedido.produtos_no_pedido.length} {pedido.produtos_no_pedido.length === 1 ? 'produto' : 'produtos'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-green-600">
                    R$ {pedido.produtos_no_pedido.reduce((total: number, item: any) => {
                      return total + (item.produto?.preco || 0) * item.quantidade;
                    }, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Nenhum produto encontrado neste pedido</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Componente Modal de Edição Cliente
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
    const fieldsToValidate = ['nome', 'email', 'telefone'];
    fieldsToValidate.forEach(field => {
      validateField(field, editData[field as keyof UpdateClienteData] || '');
    });

    if (Object.keys(errors).length > 0) return;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil"
      maxWidth="md"
      footerContent={
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !isFormValid()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-800 transition-all font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
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
    </Modal>
  );
};

// Componente Modal de Edição de Vendedor
const EditVendedorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  vendedor: Vendedor | null;
  onSave: (data: UpdateVendedorData) => Promise<void>;
}> = ({ isOpen, onClose, vendedor, onSave }) => {
  const [editData, setEditData] = useState<UpdateVendedorData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (vendedor && isOpen) {
      setEditData({
        nome: vendedor.nome,
        telefone: vendedor.telefone,
        endereco_venda: vendedor.endereco_venda
      });
      setErrors({});
    }
  }, [vendedor, isOpen]);

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
      case 'telefone':
        if (!value.trim()) {
          newErrors.telefone = 'Telefone é obrigatório';
        } else {
          delete newErrors.telefone;
        }
        break;
      case 'endereco_venda':
        if (!value.trim()) {
          newErrors.endereco_venda = 'Endereço é obrigatório';
        } else {
          delete newErrors.endereco_venda;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'telefone') {
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
    const fieldsToValidate = ['nome', 'telefone', 'endereco_venda'];
    fieldsToValidate.forEach(field => {
      validateField(field, editData[field as keyof UpdateVendedorData] || '');
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
           editData.telefone?.trim() && 
           editData.endereco_venda?.trim() &&
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
                <p className="text-white/80 text-sm">Atualize suas informações</p>
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
              <p className="text-red-600 text-sm mt-1">⚠️ {errors.nome}</p>
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
              <p className="text-red-600 text-sm mt-1">⚠️ {errors.telefone}</p>
            )}
          </div>

          {/* Endereço de Venda */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Endereço de Venda *
            </label>
            <textarea
              value={editData.endereco_venda || ''}
              onChange={(e) => handleInputChange('endereco_venda', e.target.value)}
              placeholder="Digite o endereço onde você vende"
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all resize-none ${
                errors.endereco_venda ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={loading}
            />
            {errors.endereco_venda && (
              <p className="text-red-600 text-sm mt-1">⚠️ {errors.endereco_venda}</p>
            )}
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !isFormValid()}
              className="flex-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-800 transition-all font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
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
        </div>
      </div>
    </div>
  );
};

const PerfilCliente: React.FC = () => {
  const { user, logout, userType } = useAuth();
  const { favoritos, removerFavorito, carregarFavoritos } = useFavoritos();
  const { adicionarAoCarrinho } = useCarrinho();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('pedidos');
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [fotoValor, setFotoValor] = useState<File | string>('');
  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [fotoError, setFotoError] = useState<string>('');
  const [fotoLoading, setFotoLoading] = useState<boolean>(false);


  useEffect(() => {
    // Para vendedores, apenas mostrar informações básicas sem carregar dados de cliente
    if (userType === 'VENDEDOR') {
      setLoading(false);
      return;
    }
    
    if (user?.cliente?.cpf) {
      carregarDadosCompletos();
      carregarPedidos();
    }
  }, [user, userType]);

  const carregarPedidos = async () => {
    if (!user?.cliente?.cpf) {
      console.warn('⚠️ CPF do usuário não disponível');
      return;
    }

    try {
      setLoadingPedidos(true);
      
      // Tenta a rota padrão primeiro (requer autenticação)
      let pedidosData = await pedidoService.listarPedidos();
      
      setPedidos(pedidosData || []);

      
      // Log detalhado da estrutura dos pedidos
      if (pedidosData && pedidosData.length > 0) {

        if (pedidosData[0].atende_um && pedidosData[0].atende_um.length > 0) {

        }
      }
    } catch (err: any) {
      console.error('❌ Erro ao carregar pedidos:', err);
      console.error('❌ Detalhes do erro:', err.response?.data || err.message);
      setPedidos([]);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getItensPedido = (pedido: Pedido) => {
    if (Array.isArray(pedido.produtos_no_pedido) && pedido.produtos_no_pedido.length > 0) return pedido.produtos_no_pedido;
    if (Array.isArray(pedido.atende_um) && pedido.atende_um.length > 0) return pedido.atende_um;
    return [];
  };

  const getNomeProduto = (item: any) => item?.produto?.nome || item?.produto?.nome_produto || item?.nome || `Produto ${item?.fk_produto || ''}`;
  const getQuantidadeItem = (item: any) => Number(item?.quantidade ?? item?.qty ?? 1) || 1;
  const getValorUnitario = (item: any) => Number(item?.preco ?? item?.valor ?? item?.valor_unitario ?? item?.produto?.preco ?? item?.produto?.valor ?? item?.produto?.preco_venda ?? 0) || 0;
  const getVendedorItem = (item: any) => item?.produto?.vendedor || item?.vendedor || item?.vendedor_info || item?.associacao || null;

  const getTotalPedido = (pedido: Pedido) => {
    const itens = getItensPedido(pedido);
    return itens.reduce((acc, item) => acc + (getQuantidadeItem(item) * getValorUnitario(item)), 0);
  };

  const pedidoFoiPago = (pedido: Pedido) => {
    const status = String((pedido as any)?.status || (pedido as any)?.pagamento?.status || '').toUpperCase();
    return ['PAGO', 'APROVADO', 'APPROVED', 'PAID'].includes(status);
  };

  const baixarComprovantePDF = (pedido: Pedido) => {
    const doc = new jsPDF();
    const margemX = 14;
    let y = 16;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Comprovante do Pedido #${pedido.pedido_id}`, margemX, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margemX, y);
    y += 10;

    doc.setDrawColor(210, 210, 210);
    doc.line(margemX, y, 196, y);
    y += 8;

    const clienteNome = (pedido as any)?.cliente?.nome || '-';
    const clienteCpf = (pedido as any)?.cliente?.cpf || '-';
    const feiraNome = pedido.feira?.nome || `Feira #${pedido.fk_feira}` || '-';
    const retiradaNome = pedido.associacao_retirada?.nome || pedido.retirada_local || 'Não informado';
    const retiradaEndereco = pedido.associacao_retirada?.endereco || '';
    const retiradaHorario = pedido.associacao_retirada?.data_hora || '';

    const linhasInformacoes = [
      `Data do pedido: ${new Date(pedido.data_pedido).toLocaleString('pt-BR')}`,
      `Cliente: ${clienteNome}`,
      `CPF: ${clienteCpf}`,
      `Feira: ${feiraNome}`,
      `Local de retirada: ${retiradaNome}`,
      retiradaEndereco ? `Endereço: ${retiradaEndereco}` : '',
      retiradaHorario ? `Horário: ${retiradaHorario}` : '',
      `Status: ${String((pedido as any)?.status || (pedido as any)?.pagamento?.status || '-').toUpperCase()}`,
      `Pagamento: ${pedidoFoiPago(pedido) ? 'Confirmado' : 'Pendente'}`,
    ].filter(Boolean);

    linhasInformacoes.forEach((linha) => {
      const wrapped = doc.splitTextToSize(linha, 180);
      doc.text(wrapped, margemX, y);
      y += wrapped.length * 6;
    });

    y += 4;
    doc.setDrawColor(210, 210, 210);
    doc.line(margemX, y, 196, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Produtos', margemX, y);
    y += 7;

    const itens = getItensPedido(pedido);
    if (itens.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.text('Nenhum item encontrado.', margemX, y);
      y += 8;
    } else {
      itens.forEach((item) => {
        const vendedor = getVendedorItem(item);
        const nomeVendedor = vendedor?.nome || vendedor?.nome_vendedor || '-';
        const quantidade = getQuantidadeItem(item);
        const valorUnit = getValorUnitario(item);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const nomeProduto = doc.splitTextToSize(getNomeProduto(item), 140);
        doc.text(nomeProduto, margemX, y);
        y += nomeProduto.length * 5;

        doc.setFont('helvetica', 'normal');
        doc.text(`Quantidade: ${quantidade}`, margemX, y);
        y += 5;
        doc.text(`Vendedor: ${nomeVendedor}`, margemX, y);
        y += 5;
        doc.text(`Valor unitário: ${formatarMoeda(valorUnit)}`, margemX, y);
        y += 5;
        doc.text(`Subtotal: ${formatarMoeda(quantidade * valorUnit)}`, margemX, y);
        y += 7;

        if (y > 270) {
          doc.addPage();
          y = 16;
        }
      });
    }

    y += 2;
    doc.setDrawColor(210, 210, 210);
    doc.line(margemX, y, 196, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text(`Total do pedido: ${formatarMoeda(getTotalPedido(pedido))}`, margemX, y);

    doc.save(`comprovante_pedido_${pedido.pedido_id}.pdf`);
  };

  const carregarDadosCompletos = async () => {
    if (!user?.cliente?.cpf) return;
    
    try {

      setLoading(true);
      setError('');
      
      const dadosCompletos = await clienteService.buscarPerfilCompleto(user.cliente.cpf);
      
      setCliente(dadosCompletos.cliente);
      
      // Carregar foto de perfil se existir
      if (dadosCompletos?.cliente?.foto_perfil) {
        setFotoPreview(dadosCompletos.cliente.foto_perfil);
      }

      
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (editData: UpdateClienteData) => {
    if (!user?.cliente?.cpf) return;
    
    try {

      
      const clienteAtualizado = await clienteService.atualizar(user.cliente.cpf, editData);
      
      setCliente(clienteAtualizado);
      
      
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

  const salvarFotoPerfil = async () => {
    if (!user?.cliente?.cpf) return;
    if (!fotoPreview) {
      setFotoError('Selecione uma imagem antes de salvar');
      return;
    }

    try {
      setFotoLoading(true);
      setFotoError('');

      // fotoPreview já é base64 ou URL, pode enviar direto
      const atualizado = await clienteService.atualizarFotoPerfil(user.cliente.cpf, fotoPreview);
      setCliente(atualizado);
      if (atualizado?.foto_perfil) {
        setFotoPreview(atualizado.foto_perfil);
      }
      // Limpar fotoValor após salvar
      setFotoValor('');

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
            <p class="font-semibold">Foto de perfil atualizada!</p>
            <p class="text-sm opacity-90">Sua imagem foi salva com sucesso</p>
          </div>
        </div>
      `;
      document.body.appendChild(successToast);
      requestAnimationFrame(() => {
        successToast.style.transform = 'translateX(0)';
      });
      setTimeout(() => {
        successToast.style.transform = 'translateX(100%)';
        setTimeout(() => successToast.remove(), 300);
      }, 2500);
    } catch (err: any) {
      console.error('❌ Erro ao salvar foto de perfil:', err);
      setFotoError(err.message || 'Erro ao atualizar foto de perfil');
    } finally {
      setFotoLoading(false);
    }
  };

  // Função para salvar edições do vendedor
  const handleSaveVendedorEdit = async (editData: UpdateVendedorData) => {
    if (!user?.vendedor?.id_vendedor) return;
    
    try {
      await vendedorService.atualizar(user.vendedor.id_vendedor, editData);
      
      // Mostrar toast de sucesso
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
      setTimeout(() => successToast.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        successToast.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(successToast), 300);
      }, 4000);
      
      // Recarregar página para atualizar dados
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (err: any) {
      console.error('❌ Erro ao atualizar perfil do vendedor:', err);
      
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
      setTimeout(() => errorToast.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        errorToast.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(errorToast), 300);
      }, 5000);
      
      throw err;
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await logout();
      navigate('/login', { replace: true });
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

  // Renderização especial para VENDEDORES
  if (userType === 'VENDEDOR') {
    // Criar objeto vendedor a partir dos dados do user
    const vendedorData: Vendedor = {
      id_vendedor: user.vendedor?.id_vendedor || '',
      nome: user.nome || '',
      telefone: user.vendedor?.telefone || '',
      endereco_venda: user.vendedor?.endereco_venda || '',
      tipo_vendedor: 'PF',
      tipo_documento: 'CPF',
      numero_documento: ''
    };

    return (
      <>
        <HeaderSection />
        {/* Modal de Edição */}
        <EditVendedorModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          vendedor={vendedorData}
          onSave={handleSaveVendedorEdit}
        />

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

        {/* Conteúdo do Perfil Vendedor */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Card de Perfil */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.nome?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.nome}</h1>
                <p className="text-green-600 font-medium">👨‍🌾 Vendedor</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="font-medium text-gray-900">{user?.email || 'Não informado'}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </p>
                <p className="font-medium text-gray-900">{user?.vendedor?.telefone || 'Não informado'}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Endereço de Venda
                </p>
                <p className="font-medium text-gray-900">{user?.vendedor?.endereco_venda || 'Não informado'}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg md:col-span-2">
                <p className="text-sm text-blue-600 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  ID do Vendedor
                </p>
                <p className="font-medium text-gray-900 text-xs break-all">{user?.vendedor?.id_vendedor || 'Não disponível'}</p>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/produtos/cadastro"
                className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all"
              >
                <Package className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Cadastrar Produto</h3>
                  <p className="text-sm text-gray-600">Adicione novos produtos</p>
                </div>
              </Link>

              <Link
                to="/produtos"
                className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all"
              >
                <ShoppingBag className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Meus Produtos</h3>
                  <p className="text-sm text-gray-600">Gerencie seus produtos</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderSection />
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Dados Pessoais */}
          <div className="lg:col-span-1">
            {/* Box da Foto de Perfil */}
            <div className="mb-6 flex flex-col items-center gap-4">
              <div className="relative w-[167px] h-[167px] group">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-green-600 flex items-center justify-center bg-white shadow-lg">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                      <User className="w-20 h-20 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Botão de editar foto sobreposto */}
                <label 
                  htmlFor="foto-perfil-input" 
                  className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-xl cursor-pointer transition-all hover:scale-110 group-hover:ring-4 group-hover:ring-green-200"
                  title="Alterar foto de perfil"
                >
                  <Edit3 className="w-5 h-5" />
                </label>
                <input
                  id="foto-perfil-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    // Validar tipo
                    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                    if (!validTypes.includes(file.type)) {
                      setFotoError('Formato inválido. Use: JPG, PNG ou WEBP');
                      return;
                    }
                    
                    // Validar tamanho (2MB)
                    if (file.size > 2 * 1024 * 1024) {
                      setFotoError('A imagem deve ter no máximo 2MB');
                      return;
                    }
                    
                    setFotoError('');
                    setFotoValor(file);
                    
                    // Criar preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFotoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
              </div>
              
              {/* Botão de salvar (só aparece quando há nova foto) */}
              {fotoValor && (
                <button
                  onClick={salvarFotoPerfil}
                  disabled={fotoLoading}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {fotoLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Foto de Perfil
                    </>
                  )}
                </button>
              )}
              
              {fotoError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  ⚠️ {fotoError}
                </p>
              )}
            </div>
            
            {/* Box de Dados Pessoais */}
            <div className="rounded-[25px] shadow-sm p-4 mb-6" style={{ background: 'rgba(251, 252, 250, 1)', border: '1px solid rgba(156, 178, 23, 1)' }}>
                {/* Título */}
                <h3 className="font-bold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', lineHeight: '100%', fontWeight: 700 }}>
                  Dados pessoais
                </h3>
                
                {/* Dados Pessoais */}
                <div className="space-y-2 text-sm mb-4">
                  <div>
                    <span className="font-bold" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.8)' }}>Nome: </span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.7)' }}>{cliente?.nome || user.nome}</span>
                  </div>
                  
                  <div>
                    <span className="font-bold" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.8)' }}>Email: </span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.7)' }}>{cliente?.email || user.email}</span>
                  </div>
                  
                  <div>
                    <span className="font-bold" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.8)' }}>Telefone: </span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.7)' }}>{cliente?.telefone || 'Não informado'}</span>
                  </div>
                </div>
                
                {/* Botão Alterar Dados */}
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(146, 169, 22, 1)',
                    color: 'rgba(146, 169, 22, 1)'
                  }}
                >
                  Alterar dados
                  <Edit3 className="w-4 h-4" style={{ color: 'rgba(146, 169, 22, 1)' }} />
                </button>
            </div>

            {/* Menu Lateral */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`block text-left transition-colors focus:outline-none ${
                  activeTab === 'pedidos' 
                    ? 'font-bold' 
                    : 'font-normal hover:text-gray-700'
                }`}
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '14px',
                  color: activeTab === 'pedidos' ? 'rgba(28, 90, 22, 1)' : 'rgba(107, 114, 128, 1)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'block',
                  width: '100%'
                }}
              >
                Pedidos
              </button>
              
              <button
                onClick={() => setActiveTab('favoritos')}
                className={`block text-left transition-colors focus:outline-none ${
                  activeTab === 'favoritos' 
                    ? 'font-bold' 
                    : 'font-normal hover:text-gray-700'
                }`}
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '14px',
                  color: activeTab === 'favoritos' ? 'rgba(28, 90, 22, 1)' : 'rgba(107, 114, 128, 1)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'block',
                  width: '100%'
                }}
              >
                Favoritos
              </button>

              <button
                onClick={() => setActiveTab('assinaturas')}
                className={`block text-left transition-colors focus:outline-none ${
                  activeTab === 'assinaturas' 
                    ? 'font-bold' 
                    : 'font-normal hover:text-gray-700'
                }`}
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '14px',
                  color: activeTab === 'assinaturas' ? 'rgba(28, 90, 22, 1)' : 'rgba(107, 114, 128, 1)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'block',
                  width: '100%'
                }}
              >
                Assinaturas
              </button>

              <button
                onClick={handleLogout}
                className="block text-left font-normal transition-colors focus:outline-none hover:text-gray-700"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(107, 114, 128, 1)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'block',
                  width: '100%'
                }}
              >
                Sair
              </button>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {activeTab === 'pedidos' && (
              <div className="w-full">
                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Pedidos
                </h3>

                <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  Aqui você pode revisar seus pedidos e baixar o comprovante em PDF quando precisar mostrar o pagamento.
                </div>

                {loadingPedidos ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando pedidos...</p>
                  </div>
                ) : pedidos.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h3>
                    <p className="text-gray-600 mb-6">
                      Quando você fizer pedidos, eles aparecerão aqui
                    </p>
                    <Link 
                      to="/produtos" 
                      className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Explorar Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pedidos.map((pedido) => (
                      <div 
                        key={pedido.pedido_id} 
                        className="bg-white rounded-[20px] p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col h-full justify-between">
                          {/* Header do Pedido */}
                          <div>
                            <div className="flex items-start gap-4 mb-4">
                              {/* Imagem do Produto (placeholder cinza se não tiver) */}
                              <div className="flex-shrink-0">
                                {pedido.produtos_no_pedido && pedido.produtos_no_pedido.length > 0 && pedido.produtos_no_pedido[0].produto?.image ? (
                                  <img 
                                    src={pedido.produtos_no_pedido[0].produto.image} 
                                    alt="Produto"
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  Pedido #{pedido.pedido_id}
                                </h4>
                                
                                {pedido.produtos_no_pedido && pedido.produtos_no_pedido.length > 0 && (
                                  <p className="text-2xl font-bold mb-2" style={{ color: 'rgba(146, 169, 22, 1)', fontFamily: 'Montserrat, sans-serif' }}>
                                    R$ {pedido.produtos_no_pedido.reduce((total: number, item: any) => {
                                      return total + (item.produto?.preco || 0) * item.quantidade;
                                    }, 0).toFixed(2)}
                                  </p>
                                )}
                                
                                <p className="text-sm text-gray-600">
                                  Status: <span className="text-gray-900">Retirada realizada</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => {
                                setPedidoSelecionado(pedido);
                                setShowPedidoModal(true);
                              }}
                              className="flex-1 px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                              style={{
                                fontFamily: 'Montserrat, sans-serif',
                                background: 'rgba(146, 169, 22, 1)',
                                color: '#ffffff',
                                border: 'none'
                              }}
                            >
                              Ver detalhes
                            </button>

                            <button
                              onClick={() => baixarComprovantePDF(pedido)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-green-600 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Baixar PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favoritos' && (() => {

              
              return (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-red-500" />
                      Produtos Favoritos ({favoritos.length})
                    </h3>
                    <button
                      onClick={() => {
                        carregarFavoritos();
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      🔄 Recarregar Favoritos
                    </button>
                  </div>
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
                      className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Explorar Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoritos.map((produto) => (
                        <div key={produto.id_produto} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white group">
                          <div className="relative">
                            <img 
                              src={produto.image || 'https://via.placeholder.com/300x200/f0f0f0/999?text=Produto'} 
                              alt={produto.nome}
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => removerFavorito(produto.id_produto)}
                              className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-500 rounded-full shadow-md transition-all group-hover:scale-110"
                              title="Remover dos favoritos"
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500 hover:fill-white hover:text-white transition-colors" />
                            </button>
                          </div>
                          
                          <div className="p-4">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">
                              {produto.nome}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {produto.descricao}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold text-green-500">
                                R$ {produto.preco.toFixed(2)}
                              </span>
                              {produto.quantidade_estoque !== undefined && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  produto.quantidade_estoque > 0 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {produto.quantidade_estoque > 0 ? 'Disponível' : 'Indisponível'}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                // Converter Produto para formato do carrinho
                                adicionarAoCarrinho({
                                  id: produto.id_produto,
                                  nome: produto.nome,
                                  preco: produto.preco,
                                  imagem: produto.image,
                                  fk_feira: produto.fk_feira
                                });
                                // Toast de sucesso
                                const toast = document.createElement('div');
                                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
                                toast.textContent = 'Produto adicionado ao carrinho!';
                                document.body.appendChild(toast);
                                setTimeout(() => toast.remove(), 3000);
                              }}
                              disabled={produto.quantidade_estoque === 0}
                              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Adicionar ao Carrinho
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })()}

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

            {activeTab === 'vendedor' && user?.papeis?.includes('VENDEDOR') && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6 text-green-500" />
                      Área do Vendedor
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Informações do Vendedor */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Dados do Vendedor
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nome</p>
                        <p className="font-semibold text-gray-900">{user?.vendedor?.nome || user.nome}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="font-semibold text-gray-900">{user?.vendedor?.telefone || 'Não informado'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Endereço de Venda</p>
                        <p className="font-semibold text-gray-900">{user?.vendedor?.endereco_venda || 'Não informado'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Editar Dados do Vendedor
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Ações Rápidas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link
                        to="/produtos/cadastro"
                        className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-300 hover:shadow-lg transition-all group"
                      >
                        <div className="bg-green-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Cadastrar Produto</h5>
                          <p className="text-sm text-gray-600">Adicione novos produtos ao catálogo</p>
                        </div>
                      </Link>

                      <Link
                        to="/produtos"
                        className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all group"
                      >
                        <div className="bg-blue-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                          <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Meus Produtos</h5>
                          <p className="text-sm text-gray-600">Gerencie seus produtos cadastrados</p>
                        </div>
                      </Link>

                      <Link
                        to="/vendedor/vendas"
                        className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all group"
                      >
                        <div className="bg-purple-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Minhas Vendas</h5>
                          <p className="text-sm text-gray-600">Acompanhe pedidos dos seus produtos</p>
                        </div>
                      </Link>

                      <Link
                        to="/vendedor/estatisticas"
                        className="flex items-center gap-4 p-5 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition-all group"
                      >
                        <div className="bg-orange-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">Estatísticas</h5>
                          <p className="text-sm text-gray-600">Veja o desempenho das suas vendas</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Dicas */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💡</div>
                      <div>
                        <h5 className="font-bold text-blue-900 mb-1">Dicas para Vendedores</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Mantenha seus produtos sempre atualizados com fotos de qualidade</li>
                          <li>• Responda rapidamente às dúvidas dos clientes</li>
                          <li>• Atualize regularmente o estoque dos seus produtos</li>
                          <li>• Cadastre-se em feiras para aumentar sua visibilidade</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Detalhes do Pedido */}
      <PedidoModal
        isOpen={showPedidoModal}
        onClose={() => {
          setShowPedidoModal(false);
          setPedidoSelecionado(null);
        }}
        pedido={pedidoSelecionado}
      />
      
      {/* Modal de Edição */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        cliente={cliente}
        onSave={handleSaveEdit}
      />
      </div>
      <FooterSection />
    </>
  );
};

export default PerfilCliente;