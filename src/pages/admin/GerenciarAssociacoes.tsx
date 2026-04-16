import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout';
import associacaoService from '../../services/associacaoService';
import type { Associacao } from '../../services/associacaoService';
import { 
  Building2, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Upload,
  X,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Modal';

const GerenciarAssociacoes: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [associacaoParaDeletar, setAssociacaoParaDeletar] = useState<Associacao | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [associacaoParaEditar, setAssociacaoParaEditar] = useState<Associacao | null>(null);
  const [editData, setEditData] = useState({
    nome: '',
    descricao: '',
    image: '',
    endereco: '',
    data_hora: ''
  });
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [editLoading, setEditLoading] = useState(false);
  const [atualizandoRetiradaId, setAtualizandoRetiradaId] = useState<string | null>(null);
  const [atualizandoTodasRetirada, setAtualizandoTodasRetirada] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      alert('Acesso negado. Apenas administradores podem gerenciar associações.');
      navigate('/');
      return;
    }
    carregarAssociacoes();
  }, [isAdmin, navigate]);

  const carregarAssociacoes = async () => {
    try {
      setLoading(true);
      const data = await associacaoService.getAll();
      setAssociacoes(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar associações');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!associacaoParaDeletar) return;

    try {
      setDeleteLoading(true);
      await associacaoService.delete(associacaoParaDeletar.id_associacao);
      
      // Sucesso - remover da lista
      setAssociacoes(prev => prev.filter(a => a.id_associacao !== associacaoParaDeletar.id_associacao));
      setDeleteModal(false);
      setAssociacaoParaDeletar(null);
      
      // Toast de sucesso
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      toast.textContent = 'Associação deletada com sucesso!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (err: any) {
      alert(`Erro ao deletar: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmarDelete = (associacao: Associacao) => {
    setAssociacaoParaDeletar(associacao);
    setDeleteModal(true);
  };

  const abrirEdicao = (associacao: Associacao) => {
    setAssociacaoParaEditar(associacao);
    setEditData({
      nome: associacao.nome,
      descricao: associacao.descricao,
      image: associacao.image || '',
      endereco: associacao.endereco || '',
      data_hora: associacao.data_hora || ''
    });
    setImagemPreview(getImageSrc(associacao.image) || '');
    setEditModal(true);
  };

  const alternarRetirada = async (idAssociacao: string, disponibilidadeAtual: boolean) => {
    try {
      setAtualizandoRetiradaId(idAssociacao);
      const atualizado = await associacaoService.atualizarDisponibilidadeRetirada(idAssociacao, !disponibilidadeAtual);

      setAssociacoes((prev) => prev.map((assoc) => (
        assoc.id_associacao === idAssociacao
          ? { ...assoc, disponivel_retirada: atualizado.disponivel_retirada ?? !disponibilidadeAtual }
          : assoc
      )));
    } catch (err: any) {
      alert(`Erro ao atualizar retirada: ${err.message || 'Tente novamente.'}`);
    } finally {
      setAtualizandoRetiradaId(null);
    }
  };

  const liberarTodasRetirada = async () => {
    const pendentes = associacoes.filter((assoc) => assoc.disponivel_retirada !== true);
    if (pendentes.length === 0) return;

    try {
      setAtualizandoTodasRetirada(true);

      await Promise.all(
        pendentes.map((assoc) => associacaoService.atualizarDisponibilidadeRetirada(assoc.id_associacao, true))
      );

      setAssociacoes((prev) => prev.map((assoc) => ({ ...assoc, disponivel_retirada: true })));
    } catch (err: any) {
      alert(`Erro ao liberar retirada para todas: ${err.message || 'Tente novamente.'}`);
    } finally {
      setAtualizandoTodasRetirada(false);
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('A imagem deve ter no máximo 50MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditData(prev => ({ ...prev, image: base64String }));
      setImagemPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSalvarEdicao = async () => {
    if (!associacaoParaEditar) return;

    try {
      setEditLoading(true);
      await associacaoService.update(associacaoParaEditar.id_associacao, editData);
      
      // Atualizar lista
      await carregarAssociacoes();
      
      // Fechar modal
      setEditModal(false);
      setAssociacaoParaEditar(null);
      
      // Toast de sucesso
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      toast.textContent = 'Associação atualizada com sucesso!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (err: any) {
      alert(`Erro ao atualizar: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  // Filtrar associações
  const associacoesFiltradas = associacoes.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageSrc = (image: string | null | undefined): string | null => {
    if (!image) return null;
    if (image.startsWith('data:image') || image.startsWith('data:')) return image;
    if (image.startsWith('/9j/') || image.startsWith('iVBOR') || image.length > 100) {
      const mimeType = image.startsWith('iVBOR') ? 'png' : 'jpeg';
      return `data:image/${mimeType};base64,${image}`;
    }
    return image;
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={carregarAssociacoes}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-verde-escuro flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                Gerenciar Associações
              </h1>
              <p className="text-gray-600 mt-2">
                Total de {associacoes.length} associações cadastradas
              </p>
            </div>
            <Link
              to="/associacao/cadastro"
              className="bg-verde-escuro hover:bg-verde-escuro/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Associação
            </Link>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold text-blue-900">Associações disponíveis para retirada</p>
              <p className="text-sm text-blue-700">
                Selecione quais associações aparecerão no checkout como local de retirada.
              </p>
            </div>
            <button
              onClick={liberarTodasRetirada}
              disabled={atualizandoTodasRetirada}
              className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {atualizandoTodasRetirada ? 'Atualizando...' : 'Liberar todas'}
            </button>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-verde-escuro focus:ring-2 focus:ring-verde-escuro/20 transition-all"
            />
          </div>
        </div>

        {/* Tabela de Associações */}
        {associacoesFiltradas.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nenhuma associação encontrada' : 'Nenhuma associação cadastrada'}
            </h3>
            {!searchTerm && (
              <Link
                to="/associacao/cadastro"
                className="inline-block mt-4 text-verde-escuro hover:underline"
              >
                Cadastrar primeira associação
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-verde-escuro text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Imagem</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Descrição</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Localização</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Vendedores</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Retirada</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {associacoesFiltradas.map((associacao) => (
                    <tr key={associacao.id_associacao} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {getImageSrc(associacao.image) ? (
                          <img
                            src={getImageSrc(associacao.image)!}
                            alt={associacao.nome}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-verde-escuro opacity-50" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{associacao.nome}</p>
                        {associacao.data_hora && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {associacao.data_hora}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                          {associacao.descricao}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {associacao.endereco ? (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {associacao.endereco}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {associacao.vendedor?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => alternarRetirada(associacao.id_associacao, Boolean(associacao.disponivel_retirada))}
                          disabled={atualizandoRetiradaId === associacao.id_associacao || atualizandoTodasRetirada}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                            associacao.disponivel_retirada
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          } disabled:opacity-50`}
                          title="Definir disponibilidade para retirada"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            associacao.disponivel_retirada
                              ? 'bg-white'
                              : 'bg-gray-400'
                          }`} />
                          {associacao.disponivel_retirada
                            ? 'Retirada ativa'
                            : 'Retirada inativa'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/associacoes`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => abrirEdicao(associacao)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => confirmarDelete(associacao)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Deletar"
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
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        <Modal
          isOpen={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setAssociacaoParaDeletar(null);
          }}
          title="Confirmar Exclusão"
          showFooter={false}
        >
          {associacaoParaDeletar && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">
                    Tem certeza que deseja deletar esta associação?
                  </p>
                  <p className="text-sm text-red-700">
                    Esta ação não pode ser desfeita. A associação{' '}
                    <strong>"{associacaoParaDeletar.nome}"</strong> será permanentemente removida.
                  </p>
                  {associacaoParaDeletar.vendedor && associacaoParaDeletar.vendedor.length > 0 && (
                    <p className="text-sm text-red-700 mt-2">
                      ⚠️ Esta associação possui {associacaoParaDeletar.vendedor.length} vendedor(es) vinculado(s).
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setDeleteModal(false);
                    setAssociacaoParaDeletar(null);
                  }}
                  disabled={deleteLoading}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deletando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Deletar Associação
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de Edição */}
        <Modal
          isOpen={editModal}
          onClose={() => {
            setEditModal(false);
            setAssociacaoParaEditar(null);
          }}
          title="Editar Associação"
          maxWidth="2xl"
          showFooter={false}
        >
          {associacaoParaEditar && (
            <div className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Associação *
                </label>
                <input
                  type="text"
                  value={editData.nome}
                  onChange={(e) => setEditData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-verde-escuro transition-all"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={editData.descricao}
                  onChange={(e) => setEditData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-verde-escuro transition-all resize-none"
                  required
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Endereço
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={editData.endereco}
                    onChange={(e) => setEditData(prev => ({ ...prev, endereco: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-verde-escuro transition-all"
                    placeholder="Rua, número, bairro..."
                  />
                </div>
              </div>

              {/* Data/Hora */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data/Hora
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={editData.data_hora}
                    onChange={(e) => setEditData(prev => ({ ...prev, data_hora: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-verde-escuro transition-all"
                    placeholder="Ex: Segunda a Sábado, 6h às 12h"
                  />
                </div>
              </div>

              {/* Imagem */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagem
                </label>
                <div className="space-y-3">
                  {imagemPreview && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagemPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setImagemPreview('');
                          setEditData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-verde-escuro hover:bg-green-50 transition-all">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {imagemPreview ? 'Alterar imagem' : 'Selecionar imagem'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImagemChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">Tamanho máximo: 50MB</p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setEditModal(false);
                    setAssociacaoParaEditar(null);
                  }}
                  disabled={editLoading}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarEdicao}
                  disabled={editLoading || !editData.nome || !editData.descricao}
                  className="px-6 py-2 bg-verde-escuro text-white rounded-lg hover:bg-verde-escuro/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
          )}
        </Modal>
      </div>
    </PageLayout>
  );
};

export default GerenciarAssociacoes;
