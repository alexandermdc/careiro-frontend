import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PerfilCliente from './PerfilCliente';
// @ts-ignore - Arquivo existe mas TypeScript pode não reconhecer imediatamente
import PerfilVendedor from './PerfilVendedor';
import { SeletorPapel } from '../../components/SeletorPapel';
import { Shield } from 'lucide-react';

/**
 * Componente principal de Perfil que renderiza a visão correta
 * baseado no papel ativo do usuário
 */
const Perfil: React.FC = () => {
  const { user, userType, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">Você precisa estar logado para acessar seu perfil.</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-verde-escuro text-white rounded-lg hover:bg-verde-claro transition-colors"
          >
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  // Se o usuário tem múltiplos papéis, mostra um banner com o seletor
  const temMultiplosPapeis = user?.papeis && user.papeis.length > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de Seleção de Papel - aparece se tiver múltiplos papéis */}
      {temMultiplosPapeis && (
        <div className="bg-gradient-to-r from-verde-escuro to-verde-claro text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Você tem múltiplos perfis</h3>
                  <p className="text-sm opacity-90">
                    Selecione qual perfil deseja visualizar e gerenciar
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <SeletorPapel />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renderiza o componente correto baseado no papel ativo */}
      {userType === 'CLIENTE' && <PerfilCliente />}
      {userType === 'VENDEDOR' && <PerfilVendedor />}
      {userType === 'ADMIN' && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Shield className="w-16 h-16 text-verde-escuro mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfil de Administrador</h2>
            <p className="text-gray-600 mb-6">
              Como administrador, você tem acesso ao painel de controle.
            </p>
            <a 
              href="/admin" 
              className="inline-block px-6 py-3 bg-verde-escuro text-white rounded-lg hover:bg-verde-claro transition-colors"
            >
              Ir para o Painel Admin
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
