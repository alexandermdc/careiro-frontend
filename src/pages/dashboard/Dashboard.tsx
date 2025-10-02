import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PageLayout } from '../../components/PageLayout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-verde-escuro mb-2">
                Dashboard do Usuário
              </h1>
              <p className="text-texto">
                Bem-vindo ao seu painel de controle, {user?.nome}!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-verde-claro/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-verde-escuro mb-2">
                  Meu Perfil
                </h3>
                <p className="text-sm text-texto mb-4">
                  Gerencie suas informações pessoais
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {user?.nome}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>CPF:</strong> {user?.cpf}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Minhas Associações
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Associações que você faz parte
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                  Ver Associações
                </button>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                  Meus Produtos
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Gerencie seus produtos à venda
                </p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700 transition-colors">
                  Gerenciar Produtos
                </button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Ações Rápidas
              </h3>
              <div className="flex flex-wrap gap-4">
                <button className="bg-verde-escuro text-white px-6 py-2 rounded-md hover:bg-verde-claro transition-colors">
                  Criar Nova Associação
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Adicionar Produto
                </button>
                <button className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors">
                  Ver Relatórios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;