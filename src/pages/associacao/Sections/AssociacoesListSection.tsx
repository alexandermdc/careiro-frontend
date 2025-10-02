import React, { useState, useEffect } from 'react';
import { Building2, Plus, Eye, Edit, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import associacaoService from '../../../services/associacaoService';
import type { Associacao } from '../../../services/associacaoService';
import { useAuth } from '../../../contexts/AuthContext';

export const AssociacoesListSection: React.FC = () => {
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();

  console.log('🎯 Componente AssociacoesListSection renderizado');
  console.log('🔐 Usuário autenticado:', isAuthenticated);
  console.log('👤 Dados do usuário:', user);

  useEffect(() => {
    carregarAssociacoes();
  }, []);

  const carregarAssociacoes = async () => {
    try {
      console.log('🔄 Iniciando carregamento das associações...');
      setLoading(true);
      setError('');
      
      const data = await associacaoService.getAll();
      
      console.log('✅ Associações carregadas:', data);
      setAssociacoes(data);
    } catch (err: any) {
      console.error('❌ Erro ao carregar associações:', err);
      setError(err.message || 'Erro ao carregar associações');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta associação?')) {
      return;
    }

    try {
      console.log('🗑️ Deletando associação:', id);
      
      await associacaoService.delete(id);
      
      console.log('✅ Associação deletada com sucesso');
      
      // Recarregar a lista
      await carregarAssociacoes();
    } catch (err: any) {
      console.error('❌ Erro ao deletar associação:', err);
      alert(err.message || 'Erro ao deletar associação');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-green)]"></div>
        <span className="ml-3 text-gray-600">Carregando associações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={carregarAssociacoes}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[var(--primary-green)]" />
            Associações
          </h1>
          <p className="text-gray-600 mt-2">
            Conheça as associações parceiras do Agriconect
          </p>
        </div>
        
        {isAuthenticated && (
          <Link
            to="/associacao/cadastro"
            className="bg-[var(--primary-green)] text-white px-6 py-3 rounded-lg hover:bg-[var(--secondary-green)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Nova Associação
          </Link>
        )}
      </div>

      {/* Banner para usuários autenticados */}
      {isAuthenticated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Olá, {user?.nome}! 👋
              </h3>
              <p className="text-green-700 mb-3">
                Como usuário logado, você pode criar e gerenciar suas próprias associações.
              </p>
              <Link
                to="/associacao/cadastro"
                className="inline-flex items-center gap-2 text-green-800 hover:text-green-900 font-medium"
              >
                <Plus className="w-4 h-4" />
                Criar sua primeira associação
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Associações */}
      {associacoes.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma associação encontrada
          </h3>
          <p className="text-gray-600 mb-6">
            Seja o primeiro a cadastrar uma associação!
          </p>
          {isAuthenticated && (
            <Link
              to="/associacao/cadastro"
              className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-6 py-3 rounded-lg hover:bg-[var(--secondary-green)] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Cadastrar Associação
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {associacoes.map((associacao) => (
            <div
              key={associacao.id_associacao}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {associacao.nome}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {associacao.id_associacao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {associacao.descricao}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4" />
                  <span>Responsável: {associacao.vendedor}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </button>
                  
                  {isAuthenticated && user?.email === associacao.vendedor && (
                    <>
                      <button className="bg-yellow-50 text-yellow-600 px-3 py-2 rounded-lg hover:bg-yellow-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(associacao.id_associacao)}
                        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">🐛 Debug Info:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Total de associações: {associacoes.length}</p>
          <p>Usuário autenticado: {isAuthenticated ? 'Sim' : 'Não'}</p>
          <p>Email do usuário: {user?.email || 'N/A'}</p>
          <p>Estado de loading: {loading ? 'Carregando' : 'Concluído'}</p>
          <p>Erro: {error || 'Nenhum'}</p>
        </div>
      </div>
    </div>
  );
};