import { SearchIcon, ShoppingBagIcon, UserIcon, LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { type JSX, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "./button";
import { Input } from "./inputs";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "./navigate_menu";
import { useAuth } from "../contexts/AuthContext";
import { useBusca } from "../contexts/BuscaContext";

const navigationItems = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Feiras", href: "/feiras" },
  { label: "Associações", href: "/associacoes" },
  { label: "Sobre nós", href: "/sobrenos" },
];

export const HeaderSection = (): JSX.Element => {
  const { user, isAuthenticated, logout } = useAuth();
  const { buscar } = useBusca();
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuAberto(false);
    } catch (error) {
    }
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (termoBusca.trim()) {
      await buscar(termoBusca);
      navigate('/busca');
      setMenuAberto(false);
      setTermoBusca('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar(e as any);
    }
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <header className="w-full bg-cinza relative">
      {/* Top Bar - Logo, Busca, Ações */}
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-[166px] py-4 md:py-[33px] gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            className="w-12 h-12 md:w-[79px] md:h-[78px]"
            alt="Logo Agriconnect"
            src="https://c.animaapp.com/mfh1vpp1e8a9vm/img/ativo-1-2-1.png"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/79x78/1d4510/ffffff?text=Logo";
            }}
          />
          <div className="hidden md:block [font-family:'Inter',Helvetica] font-bold text-verde-escuro text-base md:text-[19px] tracking-[0] leading-[normal]">
            Agriconnect
          </div>
        </Link>

        {/* Busca - Sempre visível */}
        <div className="flex items-center bg-fundo-claro rounded-[30px] border border-solid border-[#d5d7d4] px-3 lg:px-6 py-2 lg:py-3 w-full max-w-[487px]">
          <Input
            placeholder="O que você procura?"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent [font-family:'Montserrat',Helvetica] font-normal text-texto text-sm lg:text-base flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-0"
          />
          <button onClick={handleBuscar} className="cursor-pointer flex-shrink-0">
            <SearchIcon className="w-5 h-5 lg:w-6 lg:h-6 text-texto hover:text-verde-escuro transition-colors" />
          </button>
        </div>

        {/* Ações - Desktop/Mobile */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
          {/* Carrinho - APENAS Desktop >= 1024px */}
          <Link to="/carrinho" className="hidden lg:flex max-lg:!hidden items-center gap-1 md:gap-2 p-2 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="[font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-sm md:text-base text-center tracking-[0] leading-[normal]">
              Sacola
            </span>
            <ShoppingBagIcon className="w-5 h-5 md:w-6 md:h-6 text-verde-escuro" />
          </Link>

          {/* User Menu - APENAS Desktop >= 1024px */}
          <div className="hidden lg:flex max-lg:!hidden items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-verde-escuro font-medium text-sm">
                  Olá, {user?.nome}
                </span>
                <Button asChild variant="outline" size="default" className="h-12 inline-flex items-center justify-center gap-2 px-4 rounded-2xl border-verde-claro">
                  <Link to="/perfil" className="inline-flex items-center gap-2">
                    <span className="font-medium text-verde-claro text-sm">Meu Perfil</span>
                    <UserIcon className="w-5 h-5 text-verde-claro" />
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="default" 
                  className="h-12 inline-flex items-center justify-center gap-2 px-4 rounded-2xl border-red-500 text-red-500 hover:bg-red-50"
                >
                  <span className="font-medium text-sm">Sair</span>
                  <LogOutIcon className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="default" className="h-12 inline-flex items-center justify-center gap-2 px-4 rounded-2xl border-verde-claro">
                  <Link to="/login" className="inline-flex items-center gap-2">
                    <span className="font-medium text-verde-claro text-sm">Fazer login</span>
                    <UserIcon className="w-5 h-5 text-verde-claro" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-2xl border-verde-claro">
                  <a href="/app-careiro.apk" download className="text-verde-claro text-sm font-medium">
                    Baixar App
                  </a>
                </Button>
              </>
            )}
          </div>

          {/* Menu Hamburguer - Mobile/Tablet APENAS < 1024px */}
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="lg:hidden max-lg:flex p-2 hover:bg-verde-claro/10 rounded-full transition-colors"
            aria-label="Menu"
          >
            {menuAberto ? (
              <XIcon className="w-6 h-6 text-verde-escuro" />
            ) : (
              <MenuIcon className="w-6 h-6 text-verde-escuro" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile - Overlay - APENAS < 1024px */}
      {menuAberto && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden max-lg:block fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={fecharMenu}
          />
          
          {/* Menu Drawer */}
          <div className="lg:hidden max-lg:block fixed top-0 right-0 h-full w-full max-w-[320px] bg-white z-50 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header do Menu */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-verde-escuro">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <button 
                  onClick={fecharMenu} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors touch-manipulation"
                  aria-label="Fechar menu"
                >
                  <XIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* User Info Mobile */}
              {isAuthenticated && (
                <div className="p-4 bg-verde-claro/5 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-verde-claro/20 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-verde-escuro" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Olá,</p>
                      <p className="text-base font-bold text-verde-escuro truncate max-w-[200px]">
                        {user?.nome}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navegação */}
              <nav className="flex-1 overflow-y-auto">
                {/* Carrinho - Destaque no Mobile */}
                <div className="py-2 border-b border-gray-200">
                  <Link
                    to="/carrinho"
                    onClick={fecharMenu}
                    className="flex items-center justify-between px-4 py-4 bg-verde-claro/5 hover:bg-verde-claro/10 transition-colors touch-manipulation mx-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-verde-escuro flex items-center justify-center">
                        <ShoppingBagIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base font-bold text-verde-escuro">Minha Sacola</span>
                    </div>
                    <span className="text-xs bg-verde-escuro text-white px-2 py-1 rounded-full">0</span>
                  </Link>
                </div>

                <div className="py-2">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Navegação
                  </p>
                  {navigationItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={fecharMenu}
                      className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-texto hover:bg-verde-claro/10 hover:text-verde-escuro transition-colors touch-manipulation border-l-4 border-transparent hover:border-verde-escuro"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Ações do Usuário Mobile */}
                <div className="border-t border-gray-200 py-2">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Conta
                  </p>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/perfil"
                        onClick={fecharMenu}
                        className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-verde-escuro hover:bg-verde-claro/10 transition-colors touch-manipulation"
                      >
                        <UserIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Meu Perfil</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left touch-manipulation"
                      >
                        <LogOutIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Sair</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={fecharMenu}
                        className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-verde-claro hover:bg-verde-claro/10 transition-colors touch-manipulation"
                      >
                        <UserIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Fazer Login</span>
                      </Link>
                      <a
                        href="/app-careiro.apk"
                        download
                        className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-verde-escuro hover:bg-verde-claro/10 transition-colors touch-manipulation"
                      >
                        <ShoppingBagIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Baixar App</span>
                      </a>
                    </>
                  )}
                </div>
              </nav>

              {/* Footer do Menu */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-center text-gray-500">
                  © 2025 Agriconnect
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Barra de Navegação - Desktop */}
      <div className="hidden lg:block w-full h-[70px] bg-verde-escuro">
        <NavigationMenu className="w-full h-full">
          <NavigationMenuList className="flex items-center justify-center gap-0 w-full h-full">
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className="inline-flex h-full items-center justify-center gap-2.5 px-6 py-2.5 hover:bg-white/10 transition-colors"
                  >
                    <div className="font-bold text-fundo-claro text-xl xl:text-2xl text-center leading-[normal] [font-family:'Montserrat',Helvetica] tracking-[0]">
                      {item.label}
                    </div>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
