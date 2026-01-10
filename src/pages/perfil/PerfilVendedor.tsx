import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Package, 
  MapPin,
  ArrowLeft,
  Save,
  Store,
  FileText,
  Building2,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import vendedorService from '../../services/vendedorService';
import type { Vendedor, UpdateVendedorData } from '../../services/vendedorService';
import { HeaderSection } from '../../components/HeaderSection';
import { FooterSection } from '../../components/FooterSection';
import Modal from '../../components/Modal';

// Componente Modal de Edição
const EditVendedorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  vendedor: Vendedor | null;
  onSave: (data: UpdateVendedorData) => Promise<void>;
}> = ({ isOpen, onClose, vendedor, onSave }) => {
  const [formData, setFormData] = useState<UpdateVendedorData>({
    nome: vendedor?.nome || '',
    telefone: vendedor?.telefone || '',
    endereco_venda: vendedor?.endereco_venda || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vendedor) {
      setFormData({
        nome: vendedor.nome || '',
        telefone: vendedor.telefone || '',
        endereco_venda: vendedor.endereco_venda || '',
      });
    }
  }, [vendedor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil de Vendedor"
      footerContent={
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-vendedor-form"
            className="flex-1 px-6 py-3 bg-verde-escuro text-white rounded-lg hover:bg-verde-claro transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      }
    >
      <form id="edit-vendedor-form" onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo / Razão Social
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-claro focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-claro focus:border-transparent"
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço de Venda
            </label>
            <textarea
              value={formData.endereco_venda}
              onChange={(e) => setFormData({ ...formData, endereco_venda: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-claro focus:border-transparent"
              rows={3}
              placeholder="Local onde você vende seus produtos"
              required
            />
          </div>
        </form>
      </Modal>
  );
};

const PerfilVendedor: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendedor, setVendedor] = useState<Vendedor | null>(null);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (user?.vendedor?.id_vendedor) {
      carregarDadosVendedor();
    } else {
      setLoading(false);
    }
  }, [user]);

  const carregarDadosVendedor = async () => {
    if (!user?.vendedor?.id_vendedor) return;
    
    try {
      setLoading(true);
      setError('');
      
      const dadosCompletos = await vendedorService.buscarPorId(user.vendedor.id_vendedor);
      setVendedor(dadosCompletos);
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados do vendedor:', err);
      setError(err.message || 'Erro ao carregar dados do perfil');
      // Se falhar, usa os dados do contexto
      setVendedor(user.vendedor);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (editData: UpdateVendedorData) => {
    if (!user?.vendedor?.id_vendedor) return;
    
    try {
      const vendedorAtualizado = await vendedorService.atualizar(user.vendedor.id_vendedor, editData);
      setVendedor(vendedorAtualizado);
      
      // Mostrar notificação de sucesso
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50';
      successToast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Perfil atualizado com sucesso!</span>
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => successToast.remove(), 3000);
      
      setShowEditModal(false);
    } catch (err: any) {
      console.error('❌ Erro ao atualizar vendedor:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil do vendedor...</p>
        </div>
      </div>
    );
  }

  const vendedorAtual = vendedor || user?.vendedor;

  return (
    <>
      <HeaderSection />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-verde-escuro hover:text-verde-claro transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Card Principal do Perfil */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-verde-escuro to-verde-claro p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <Store className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {vendedorAtual?.nome || 'Vendedor'}
                  </h1>
                  <p className="text-white/90 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Corpo do Card */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-verde-escuro" />
                  Informações Básicas
                </h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Nome Completo / Razão Social</p>
                  <p className="text-gray-900 font-medium">{vendedorAtual?.nome || '-'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </p>
                  <p className="text-gray-900 font-medium">{vendedorAtual?.telefone || '-'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Tipo de Vendedor
                  </p>
                  <p className="text-gray-900 font-medium">
                    {vendedorAtual?.tipo_vendedor === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {vendedorAtual?.tipo_documento || 'CPF/CNPJ'}
                  </p>
                  <p className="text-gray-900 font-medium">{vendedorAtual?.numero_documento || '-'}</p>
                </div>
              </div>

              {/* Informações de Venda */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-verde-escuro" />
                  Informações de Venda
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Endereço de Venda</p>
                  <p className="text-gray-900 font-medium">{vendedorAtual?.endereco_venda || '-'}</p>
                </div>

                {vendedorAtual?.fk_associacao && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2 flex items-center gap-2 font-semibold">
                      <Building2 className="w-4 h-4" />
                      Associação Vinculada
                    </p>
                    <p className="text-blue-900 font-bold text-lg">ID: {vendedorAtual.fk_associacao}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/produtos/cadastro"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group"
          >
            <div className="bg-green-500/10 p-3 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Cadastrar Produto</h3>
              <p className="text-sm text-gray-600">Adicionar novo produto</p>
            </div>
          </Link>

          <Link
            to="/produtos/gerenciar"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group"
          >
            <div className="bg-verde-claro/10 p-3 rounded-lg group-hover:bg-verde-claro/20 transition-colors">
              <Package className="w-6 h-6 text-verde-escuro" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Meus Produtos</h3>
              <p className="text-sm text-gray-600">Gerenciar produtos</p>
            </div>
          </Link>

          <Link
            to="/feiras/cadastro"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group"
          >
            <div className="bg-verde-claro/10 p-3 rounded-lg group-hover:bg-verde-claro/20 transition-colors">
              <Store className="w-6 h-6 text-verde-escuro" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Minhas Feiras</h3>
              <p className="text-sm text-gray-600">Gerenciar feiras</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group border-2 border-red-100 hover:border-red-200"
          >
            <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
              <ArrowLeft className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-red-600">Sair</h3>
              <p className="text-sm text-red-500">Fazer logout</p>
            </div>
          </button>
        </div>
      </div>

      {/* Modal de Edição */}
      <EditVendedorModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        vendedor={vendedorAtual || null}
        onSave={handleSaveEdit}
      />
      </div>
      <FooterSection />
    </>
  );
};

export default PerfilVendedor;
