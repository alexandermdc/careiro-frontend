import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Store,
  Phone,
  MapPin,
  FileText,
  Building2,
  Plus
} from 'lucide-react';
import vendedorService from '../../services/vendedorService';
import associacaoService from '../../services/associacaoService';
import type { Vendedor, UpdateVendedorData } from '../../services/vendedorService';
import type { Associacao } from '../../services/associacaoService';
import Modal from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';

// Modal de Edição
const EditVendedorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  vendedor: Vendedor | null;
  associacoes: Associacao[];
  onSave: (id: string, data: UpdateVendedorData) => Promise<void>;
}> = ({ isOpen, onClose, vendedor, associacoes, onSave }) => {
  const [formData, setFormData] = useState<UpdateVendedorData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendedor && isOpen) {
      setFormData({
        nome: vendedor.nome,
        telefone: vendedor.telefone,
        endereco_venda: vendedor.endereco_venda,
        fk_associacao: vendedor.fk_associacao
      });
    }
  }, [vendedor, isOpen]);

  const handleSubmit = async () => {
    if (!vendedor) return;
    
    try {
      setLoading(true);
      await onSave(vendedor.id_vendedor, formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Vendedor"
      footerContent={
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-verde-escuro text-white rounded-lg hover:bg-verde-claro transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <input
            type="text"
            value={formData.nome || ''}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-escuro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <input
            type="text"
            value={formData.telefone || ''}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-escuro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço de Venda</label>
          <textarea
            value={formData.endereco_venda || ''}
            onChange={(e) => setFormData({ ...formData, endereco_venda: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-escuro"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Associação</label>
          <select
            value={formData.fk_associacao || ''}
            onChange={(e) => setFormData({ ...formData, fk_associacao: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-escuro"
          >
            <option value="">Selecione uma associação</option>
            {associacoes.map((assoc) => (
              <option key={assoc.id_associacao} value={assoc.id_associacao}>
                {assoc.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

const GerenciarVendedores: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [vendedorSelecionado, setVendedorSelecionado] = useState<Vendedor | null>(null);

  // Verificar se é admin
  useEffect(() => {
    if (!user) {
      alert('⚠️ Você precisa estar logado como administrador!');
      navigate('/login');
      return;
    }
    
    if (user.tipo !== 'ADMIN') {
      alert('⚠️ Apenas administradores podem acessar esta página!');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [vendedoresData, associacoesData] = await Promise.all([
        vendedorService.listarTodos(),
        associacaoService.getAll()
      ]);
      setVendedores(vendedoresData);
      setAssociacoes(associacoesData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar vendedores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (vendedor: Vendedor) => {
    setVendedorSelecionado(vendedor);
    setShowEditModal(true);
  };

  const handleSalvarEdicao = async (id: string, data: UpdateVendedorData) => {
    try {
      await vendedorService.atualizar(id, data);
      await carregarDados();
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50';
      toast.innerHTML = '<span class="font-medium">✓ Vendedor atualizado com sucesso!</span>';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error: any) {
      alert('Erro ao atualizar vendedor: ' + error.message);
      throw error;
    }
  };

  const handleExcluir = async (vendedor: Vendedor) => {
    if (!confirm(`Deseja realmente excluir o vendedor "${vendedor.nome}"?`)) {
      return;
    }

    try {
      await vendedorService.deletar(vendedor.id_vendedor);
      await carregarDados();
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50';
      toast.innerHTML = '<span class="font-medium">✓ Vendedor excluído com sucesso!</span>';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error: any) {
      alert('Erro ao excluir vendedor: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando vendedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-verde-escuro hover:text-verde-claro mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Painel Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Vendedores</h1>
              <p className="text-gray-600 mt-2">Edite ou exclua vendedores cadastrados</p>
            </div>
            <Link
              to="/vendedor/cadastro"
              className="flex items-center gap-2 px-6 py-3 bg-verde-escuro text-white rounded-lg hover:bg-verde-claro transition-colors"
            >
              <Plus size={20} />
              Cadastrar Vendedor
            </Link>
          </div>
        </div>

        {/* Tabela de Vendedores */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {vendedores.length === 0 ? (
            <div className="p-12 text-center">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum vendedor cadastrado</h3>
              <p className="text-gray-600 mb-6">Cadastre o primeiro vendedor para começar</p>
              <Link
                to="/vendedor/cadastro"
                className="inline-flex items-center gap-2 px-6 py-3 bg-verde-escuro text-white rounded-lg hover:bg-verde-claro transition-colors"
              >
                <Plus size={20} />
                Cadastrar Vendedor
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Associação
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendedores.map((vendedor) => (
                    <tr key={vendedor.id_vendedor} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-verde-escuro/10 flex items-center justify-center flex-shrink-0">
                            {vendedor.image ? (
                              <img src={vendedor.image} alt={vendedor.nome} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-verde-escuro" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{vendedor.nome}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {vendedor.tipo_documento}: {vendedor.numero_documento}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {vendedor.telefone}
                          </p>
                          <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {vendedor.endereco_venda}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {vendedor.tipo_vendedor === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {vendedor.associacao?.nome ? (
                          <span className="text-sm text-gray-900 flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {vendedor.associacao.nome}
                          </span>
                        ) : vendedor.fk_associacao ? (
                          <span className="text-sm text-gray-500">ID: {vendedor.fk_associacao}</span>
                        ) : (
                          <span className="text-sm text-gray-400">Sem associação</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditar(vendedor)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleExcluir(vendedor)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      <EditVendedorModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setVendedorSelecionado(null);
        }}
        vendedor={vendedorSelecionado}
        associacoes={associacoes}
        onSave={handleSalvarEdicao}
      />
    </div>
  );
};

export default GerenciarVendedores;
