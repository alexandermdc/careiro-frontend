import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowLeft, 
  Trash2, 
  Plus,
  Eye,
  DollarSign,
  Tag,
  AlertCircle,
  Edit,
  Save,
  Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import produtoService from '../../services/produtoService';
import type { Produto } from '../../services/produtoService';
import Modal from '../../components/Modal';

const GerenciarProdutos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formEdicao, setFormEdicao] = useState<any>({});
  const [salvando, setSalvando] = useState(false);
  const [novaImagem, setNovaImagem] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string>('');
  
  // Verificar se é vendedor
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.papeis?.includes('VENDEDOR') || !user.vendedor?.id_vendedor) {
      alert('⚠️ Apenas vendedores podem gerenciar produtos!');
      navigate('/');
      return;
    }
    
    carregarProdutos();
  }, [user, navigate]);
  
  const carregarProdutos = async () => {
    if (!user?.vendedor?.id_vendedor) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await produtoService.buscarPorVendedor(user.vendedor.id_vendedor.toString());
      setProdutos(data);
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string | number | undefined, nome: string) => {
    if (!id) {
      alert('ID do produto inválido');
      return;
    }
    
    if (!confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      return;
    }
    
    try {
      setDeletingId(id);
      await produtoService.deletar(id.toString());
      
      // Atualizar lista removendo o produto deletado
      setProdutos(produtos.filter(p => (p.id_produto || p.id) !== id));
      
      // Mostrar notificação de sucesso
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50';
      successToast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Produto excluído com sucesso!</span>
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => successToast.remove(), 3000);
      
    } catch (err: any) {
      console.error('Erro ao deletar produto:', err);
      alert(`Erro ao excluir produto: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const iniciarEdicao = (produto: Produto) => {
    setFormEdicao({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      preco_promocao: produto.preco_promocao || '',
      is_promocao: produto.is_promocao || false,
      disponivel: produto.disponivel
    });
    setPreviewImagem(produto.image || '');
    setModoEdicao(true);
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
    setFormEdicao({});
    setNovaImagem(null);
    setPreviewImagem('');
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    setNovaImagem(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImagem(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const salvarEdicao = async () => {
    if (!produtoSelecionado) return;

    try {
      setSalvando(true);
      
      const formData = new FormData();
      formData.append('nome', formEdicao.nome);
      formData.append('descricao', formEdicao.descricao);
      formData.append('preco', formEdicao.preco.toString());
      // Converter booleanos para 1/0 para compatibilidade com backend
      formData.append('disponivel', formEdicao.disponivel ? '1' : '0');
      formData.append('is_promocao', formEdicao.is_promocao ? '1' : '0');
      
      if (formEdicao.preco_promocao) {
        formData.append('preco_promocao', formEdicao.preco_promocao.toString());
      }
      
      if (novaImagem) {
        formData.append('image', novaImagem);
      }

      // Atualizar produto no backend
      const id = produtoSelecionado.id_produto || produtoSelecionado.id;
      if (!id) throw new Error('ID do produto não encontrado');
      
      await produtoService.atualizar(id.toString(), formData);
      
      // Recarregar produtos
      await carregarProdutos();
      
      // Fechar modal
      setProdutoSelecionado(null);
      setModoEdicao(false);
      setNovaImagem(null);
      
      // Mostrar sucesso
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50';
      successToast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Produto atualizado com sucesso!</span>
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => successToast.remove(), 3000);
      
    } catch (err: any) {
      console.error('Erro ao atualizar produto:', err);
      alert(`Erro ao atualizar produto: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus produtos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 text-verde-escuro hover:text-verde-claro transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar ao Perfil</span>
          </Link>
          
          <Link
            to="/produtos/cadastro"
            className="inline-flex items-center gap-2 bg-verde-escuro text-white px-6 py-3 rounded-xl hover:bg-verde-claro transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Cadastrar Novo Produto</span>
          </Link>
        </div>

        {/* Título */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-verde-escuro to-verde-claro p-6 text-white">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
                <p className="text-white/90 mt-1">
                  {produtos.length} {produtos.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Lista de Produtos */}
        {produtos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-600 mb-6">
              Comece cadastrando seu primeiro produto para começar a vender!
            </p>
            <Link
              to="/produtos/cadastro"
              className="inline-flex items-center gap-2 bg-verde-escuro text-white px-8 py-3 rounded-xl hover:bg-verde-claro transition-colors"
            >
              <Plus className="w-5 h-5" />
              Cadastrar Primeiro Produto
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id_produto || produto.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              >
                {/* Imagem do Produto */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {produto.image ? (
                    <img
                      src={produto.image}
                      alt={produto.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status de Disponibilidade */}
                  <div className="absolute top-2 right-2">
                    {produto.disponivel ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Disponível
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {produto.nome}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {produto.descricao || 'Sem descrição'}
                  </p>

                  {/* Preço */}
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-verde-escuro" />
                    <span className="text-2xl font-bold text-verde-escuro">
                      R$ {produto.preco?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Estoque */}
                  {produto.quantidade_estoque !== undefined && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span>Estoque: {produto.quantidade_estoque} unidades</span>
                    </div>
                  )}

                  {/* Feira */}
                  {produto.feira && (
                    <div className="mb-4 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="font-medium">Feira:</span> {produto.feira.nome}
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => setProdutoSelecionado(produto)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                    
                    <button
                      onClick={() => handleDelete(produto.id_produto || produto.id, produto.nome)}
                      disabled={deletingId === (produto.id_produto || produto.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {deletingId === (produto.id_produto || produto.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Excluindo...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes/Edição do Produto */}
      <Modal
        isOpen={!!produtoSelecionado}
        onClose={() => {
          setProdutoSelecionado(null);
          setModoEdicao(false);
          setNovaImagem(null);
        }}
        title={modoEdicao ? "Editar Produto" : "Detalhes do Produto"}
        footerContent={
          modoEdicao ? (
            <div className="flex gap-3 w-full">
              <button
                onClick={cancelarEdicao}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                disabled={salvando}
              >
                {salvando ? (
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
          ) : (
            <button
              onClick={() => iniciarEdicao(produtoSelecionado!)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar Produto
            </button>
          )
        }
      >
        {produtoSelecionado && (
          <div className="space-y-6">
            {modoEdicao ? (
              // MODO EDIÇÃO
              <>
                {/* Upload de Imagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Produto
                  </label>
                  <div className="flex items-center gap-4">
                    {previewImagem && (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={previewImagem}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {novaImagem ? novaImagem.name : 'Clique para alterar a imagem'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImagemChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    value={formEdicao.nome}
                    onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formEdicao.descricao}
                    onChange={(e) => setFormEdicao({ ...formEdicao, descricao: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>

                {/* Preços */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Normal (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formEdicao.preco}
                      onChange={(e) => setFormEdicao({ ...formEdicao, preco: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Promocional (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formEdicao.preco_promocao}
                      onChange={(e) => setFormEdicao({ ...formEdicao, preco_promocao: parseFloat(e.target.value) || '' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!formEdicao.is_promocao}
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEdicao.is_promocao}
                      onChange={(e) => setFormEdicao({ ...formEdicao, is_promocao: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Produto em promoção</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEdicao.disponivel}
                      onChange={(e) => setFormEdicao({ ...formEdicao, disponivel: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Disponível para venda</span>
                  </label>
                </div>
              </>
            ) : (
              // MODO VISUALIZAÇÃO
              <>
            {/* Imagem */}
            {produtoSelecionado.image && (
              <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={produtoSelecionado.image}
                  alt={produtoSelecionado.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Nome e Categoria */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {produtoSelecionado.nome}
              </h3>
              {produtoSelecionado.categoria && (
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {produtoSelecionado.categoria.nome}
                </span>
              )}
            </div>

            {/* Preços */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preço</p>
                  <p className={`text-2xl font-bold ${produtoSelecionado.is_promocao ? 'line-through text-gray-400' : 'text-green-600'}`}>
                    R$ {produtoSelecionado.preco.toFixed(2)}
                  </p>
                </div>
                {produtoSelecionado.is_promocao && produtoSelecionado.preco_promocao && (
                  <div>
                    <p className="text-sm text-red-600 mb-1">Promoção</p>
                    <p className="text-3xl font-bold text-red-600">
                      R$ {produtoSelecionado.preco_promocao.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h4>
              <p className="text-gray-700 leading-relaxed">
                {produtoSelecionado.descricao}
              </p>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Disponibilidade</p>
                <p className={`font-semibold ${produtoSelecionado.disponivel ? 'text-green-600' : 'text-red-600'}`}>
                  {produtoSelecionado.disponivel ? '✓ Disponível' : '✗ Indisponível'}
                </p>
              </div>
              
              {produtoSelecionado.quantidade_estoque !== undefined && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Estoque</p>
                  <p className="font-semibold text-gray-900">
                    {produtoSelecionado.quantidade_estoque} unidades
                  </p>
                </div>
              )}
            </div>

            {/* Vendedor */}
            {produtoSelecionado.vendedor && (
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Vendedor</p>
                <p className="font-semibold text-gray-900">
                  {produtoSelecionado.vendedor.nome}
                </p>
                {produtoSelecionado.vendedor.email && (
                  <p className="text-sm text-gray-600 mt-1">
                    {produtoSelecionado.vendedor.email}
                  </p>
                )}
              </div>
            )}
          </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GerenciarProdutos;
