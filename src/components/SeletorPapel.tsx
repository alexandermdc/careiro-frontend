import { useState, useEffect } from 'react';
import authService from '../services/authService';
import type { UserType } from '../services/authService';
import { User, Store, ShoppingCart } from 'lucide-react';

export const SeletorPapel = () => {
  const [papeis, setPapeis] = useState<UserType[]>([]);
  const [papelAtivo, setPapelAtivo] = useState<UserType | null>(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(() => {
    const usuario = authService.getCurrentUser();
    if (usuario) {
      setPapeis(usuario.papeis);
      setPapelAtivo(authService.getPapelAtivo());
    }
  }, []);

  // Se tiver apenas 1 papel, não mostrar seletor
  if (papeis.length <= 1) return null;

  const alternarPapel = (novoPapel: UserType) => {
    authService.setPapelAtivo(novoPapel);
    setPapelAtivo(novoPapel);
    setMostrarMenu(false);
    // Recarregar página para atualizar interface
    window.location.reload();
  };

  const getIcone = (papel: UserType) => {
    switch (papel) {
      case 'CLIENTE':
        return <ShoppingCart className="w-4 h-4" />;
      case 'VENDEDOR':
        return <Store className="w-4 h-4" />;
      case 'ADMIN':
        return <User className="w-4 h-4" />;
    }
  };

  const getLabel = (papel: UserType) => {
    switch (papel) {
      case 'CLIENTE':
        return 'Cliente';
      case 'VENDEDOR':
        return 'Vendedor';
      case 'ADMIN':
        return 'Admin';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarMenu(!mostrarMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-verde-escuro rounded-lg hover:bg-verde-claro/10 transition-colors"
        title="Alternar perfil"
      >
        {papelAtivo && getIcone(papelAtivo)}
        <span className="font-medium text-verde-escuro">
          {papelAtivo && getLabel(papelAtivo)}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${mostrarMenu ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {mostrarMenu && (
        <>
          {/* Backdrop para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setMostrarMenu(false)}
          />
          
          {/* Menu dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 bg-verde-escuro text-white">
              <p className="text-sm font-semibold">Alternar Perfil</p>
              <p className="text-xs opacity-90">Você tem múltiplos papéis</p>
            </div>
            
            <div className="p-2">
              {papeis.map((papel) => (
                <button
                  key={papel}
                  onClick={() => alternarPapel(papel)}
                  disabled={papel === papelAtivo}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                    ${papel === papelAtivo 
                      ? 'bg-verde-claro text-verde-escuro font-semibold cursor-default' 
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {getIcone(papel)}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{getLabel(papel)}</div>
                    {papel === 'CLIENTE' && (
                      <div className="text-xs opacity-70">Comprar produtos</div>
                    )}
                    {papel === 'VENDEDOR' && (
                      <div className="text-xs opacity-70">Gerenciar vendas</div>
                    )}
                    {papel === 'ADMIN' && (
                      <div className="text-xs opacity-70">Administrar sistema</div>
                    )}
                  </div>
                  {papel === papelAtivo && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
