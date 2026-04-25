import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout';
import { TabelaGerenciamento, acoesComuns, type Coluna } from '../../components/TabelaGerenciamento';
import { ModalConfirmacaoExclusao } from '../../components/ModalConfirmacaoExclusao';
import feiraService from '../../services/feiraService';
import type { Feira } from '../../services/feiraService';
import toast from '../../utils/toast';
import { 
  Store, 
  Plus,
  Search,
  Calendar,
  MapPin,
  AlertCircle,
  Upload,
  X,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Modal';
import { ModalNotificacao } from '../../components/ModalNotificacao';
import { useNotificacao } from '../../hooks/useNotificacao';

const GerenciarFeiras: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const notificacao = useNotificacao();
  const [feiras, setFeiras] = useState<Feira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [feiraParaDeletar, setFeiraParaDeletar] = useState<Feira | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [feiraParaEditar, setFeiraParaEditar] = useState<Feira | null>(null);
  const [editData, setEditData] = useState({
    nome: '',
    descricao: '',
    image: '',
    localizacao: '',
    data_hora: ''
  });
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [editLoading, setEditLoading] = useState(false);
  const [atualizandoRetiradaId, setAtualizandoRetiradaId] = useState<number | null>(null);
  const [atualizandoTodasRetirada, setAtualizandoTodasRetirada] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      notificacao.erro('Acesso negado. Apenas administradores podem gerenciar feiras.');
      navigate('/');
      return;
    }
    carregarFeiras();
  }, [isAdmin, navigate]);

  const carregarFeiras = async () => {
    try {
      setLoading(true);
      const data = await feiraService.listarTodas();
      setFeiras(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar feiras');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!feiraParaDeletar) return;

    try {
      setDeleteLoading(true);
      await feiraService.deletar(feiraParaDeletar.id_feira);
      
      // Sucesso - remover da lista
      setFeiras(prev => prev.filter(f => f.id_feira !== feiraParaDeletar.id_feira));
      setDeleteModal(false);
      setFeiraParaDeletar(null);
      
      // Toast de sucesso
      toast.success('Feira deletada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao deletar feira', err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmarDelete = (feira: Feira) => {
    setFeiraParaDeletar(feira);
    setDeleteModal(true);
  };

  const abrirEdicao = (feira: Feira) => {
    setFeiraParaEditar(feira);
    setEditData({
      nome: feira.nome,
      descricao: feira.descricao || '',
      image: feira.image || '',
      localizacao: feira.localizacao || '',
      data_hora: feira.data_hora || ''
    });
    setImagemPreview(getImageSrc(feira.image) || '');
    setEditModal(true);
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      notificacao.aviso('A imagem deve ter no máximo 50MB');
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
    if (!feiraParaEditar) return;

    try {
      setEditLoading(true);
      await feiraService.atualizar(feiraParaEditar.id_feira, editData);
      
      // Atualizar lista
      await carregarFeiras();
      
      // Fechar modal
      setEditModal(false);
      setFeiraParaEditar(null);
      
      // Toast de sucesso
      toast.success('Feira atualizada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar feira', err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const alternarRetirada = async (idFeira: number, disponibilidadeAtual: boolean) => {
    try {
      setAtualizandoRetiradaId(idFeira);
      const atualizado = await feiraService.atualizarDisponibilidadeRetirada(idFeira, !disponibilidadeAtual);

      setFeiras((prev) => prev.map((feira) => (
        feira.id_feira === idFeira
          ? { ...feira, disponivel_retirada: atualizado.disponivel_retirada ?? !disponibilidadeAtual }
          : feira
      )));
    } catch (err: any) {
      toast.error('Erro ao atualizar retirada', err.message || 'Tente novamente.');
    } finally {
      setAtualizandoRetiradaId(null);
    }
  };

  const liberarTodasRetirada = async () => {
    const pendentes = feiras.filter((feira) => feira.disponivel_retirada !== true);
    if (pendentes.length === 0) return;

    try {
      setAtualizandoTodasRetirada(true);

      await Promise.all(
        pendentes.map((feira) => feiraService.atualizarDisponibilidadeRetirada(feira.id_feira, true))
      );

      setFeiras((prev) => prev.map((feira) => ({ ...feira, disponivel_retirada: true })));
      toast.success('Retirada liberada para todas as feiras!');
    } catch (err: any) {
      toast.error('Erro ao liberar retirada para todas', err.message || 'Tente novamente.');
    } finally {
      setAtualizandoTodasRetirada(false);
    }
  };

  // Filtrar feiras
  const feirasFiltradas = feiras.filter(f => 
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Configuração das colunas da tabela
  const colunas: Coluna<Feira>[] = [
    {
      key: 'image',
      label: 'Imagem',
      render: (feira) => (
        getImageSrc(feira.image) ? (
          <img
            src={getImageSrc(feira.image)!}
            alt={feira.nome}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-orange-600 opacity-50" />
          </div>
        )
      )
    },
    {
      key: 'nome',
      label: 'Nome',
      render: (feira) => (
        <p className="font-semibold text-gray-900">{feira.nome}</p>
      )
    },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (feira) => (
        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {feira.descricao || '-'}
        </p>
      )
    },
    {
      key: 'localizacao',
      label: 'Localização',
      render: (feira) => (
        feira.localizacao ? (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {feira.localizacao}
          </p>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      )
    },
    {
      key: 'data_hora',
      label: 'Data/Hora',
      render: (feira) => (
        feira.data_hora ? (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {feira.data_hora}
          </p>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      )
    },
    {
      key: 'disponivel_retirada',
      label: 'Retirada',
      render: (feira) => (
        <button
          onClick={() => alternarRetirada(feira.id_feira, Boolean(feira.disponivel_retirada))}
          disabled={atualizandoRetiradaId === feira.id_feira || atualizandoTodasRetirada}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
            feira.disponivel_retirada
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          } disabled:opacity-50`}
          title="Definir disponibilidade para retirada"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${
            feira.disponivel_retirada
              ? 'bg-white'
              : 'bg-gray-400'
          }`} />
          {feira.disponivel_retirada
            ? 'Retirada ativa'
            : 'Retirada inativa'}
        </button>
      )
    }
  ];

  // Configuração das ações
  const acoes = [
    acoesComuns.visualizar(() => navigate('/feiras')),
    acoesComuns.editar(abrirEdicao),
    acoesComuns.deletar(confirmarDelete)
  ];

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
              onClick={carregarFeiras}
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
                <Store className="w-8 h-8" />
                Gerenciar Feiras
              </h1>
              <p className="text-gray-600 mt-2">
                Total de {feiras.length} feiras cadastradas
              </p>
            </div>
            <Link
              to="/feiras/cadastro"
              className="bg-verde-escuro hover:bg-verde-escuro/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Feira
            </Link>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, descrição ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-verde-escuro focus:ring-2 focus:ring-verde-escuro/20 transition-all"
            />
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold text-blue-900">Feiras disponíveis para retirada</p>
              <p className="text-sm text-blue-700">
                Selecione quais feiras aparecerão no checkout como local de retirada.
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
        </div>

        {/* Tabela de Feiras */}
        {feirasFiltradas.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nenhuma feira encontrada' : 'Nenhuma feira cadastrada'}
            </h3>
            {!searchTerm && (
              <Link
                to="/feiras/cadastro"
                className="inline-block mt-4 text-verde-escuro hover:underline"
              >
                Cadastrar primeira feira
              </Link>
            )}
          </div>
        ) : (
          <TabelaGerenciamento
            colunas={colunas}
            dados={feirasFiltradas}
            acoes={acoes}
            keyExtractor={(feira) => feira.id_feira.toString()}
            emptyMessage="Nenhuma feira encontrada"
            emptyIcon={Store}
          />
        )}

        {/* Modal de Confirmação de Exclusão */}
        {feiraParaDeletar && (
          <ModalConfirmacaoExclusao
            isOpen={deleteModal}
            onClose={() => {
              setDeleteModal(false);
              setFeiraParaDeletar(null);
            }}
            onConfirm={handleDelete}
            titulo="esta feira"
            nomeItem={feiraParaDeletar.nome}
            loading={deleteLoading}
          />
        )}

        {/* Modal de Edição */}
        <Modal
          isOpen={editModal}
          onClose={() => {
            setEditModal(false);
            setFeiraParaEditar(null);
          }}
          title="Editar Feira"
          maxWidth="2xl"
          showFooter={false}
        >
          {feiraParaEditar && (
            <div className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Feira *
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
                  Descrição
                </label>
                <textarea
                  value={editData.descricao}
                  onChange={(e) => setEditData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-verde-escuro transition-all resize-none"
                />
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Localização
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={editData.localizacao}
                    onChange={(e) => setEditData(prev => ({ ...prev, localizacao: e.target.value }))}
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
                    placeholder="Ex: Sábados, 6h às 12h"
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
                    setFeiraParaEditar(null);
                  }}
                  disabled={editLoading}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarEdicao}
                  disabled={editLoading || !editData.nome}
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

        {/* Modal de Notificação */}
        <ModalNotificacao
          isOpen={notificacao.isOpen}
          onClose={notificacao.fechar}
          {...notificacao.config}
        />
      </div>
    </PageLayout>
  );
};

export default GerenciarFeiras;
