import { SearchIcon, ShoppingBagIcon, UserIcon, LogOutIcon } from "lucide-react";
import { type JSX } from "react";
import { Link } from 'react-router-dom';
import { Button } from "./button";
import { Input } from "./inputs";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "./navigate_menu";
import { useAuth } from "../contexts/AuthContext";

const navigationItems = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Feiras", href: "/feiras" },
  { label: "Associações", href: "/associacao" },
  { label: "Sobre nós", href: "/sobrenos" },
];

export const HeaderSection = (): JSX.Element => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <header className="w-full bg-cinza relative">
      <div className="flex items-center justify-between px-[166px] py-[33px]">
        <div className="flex items-center gap-[9px]">
          <img
            className="w-[79px] h-[78px]"
            alt="Logo Agriconnect"
            src="https://c.animaapp.com/mfh1vpp1e8a9vm/img/ativo-1-2-1.png"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/79x78/1d4510/ffffff?text=Logo";
            }}
          />
          <div className="[font-family:'Inter',Helvetica] font-bold text-verde-escuro text-[19px] tracking-[0] leading-[normal]">
            Agriconnect
          </div>
        </div>

        <div className="flex items-center bg-fundo-claro rounded-[30px] border border-solid border-[#d5d7d4] px-6 py-3 w-[487px]">
          <Input
            placeholder="O que você procura?"
            className="border-0 bg-transparent [font-family:'Montserrat',Helvetica] font-normal text-texto text-base flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <SearchIcon className="w-6 h-6 text-texto" />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 p-2">
            <div className="[font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
              Sacola
            </div>
            <ShoppingBagIcon className="w-6 h-6 text-verde-escuro" />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-verde-escuro font-medium">
                Olá, {user?.nome}
              </span>
              <Button asChild variant="outline" size="default" className="h-12 inline-flex items-center justify-center gap-2 px-4 rounded-2xl border-verde-claro">
                <Link to="/perfil" className="inline-flex items-center gap-2">
                  <span className="font-medium text-verde-claro">Meu Perfil</span>
                  <UserIcon className="w-5 h-5 text-verde-claro" />
                </Link>
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="default" 
                className="h-12 inline-flex items-center justify-center gap-2 px-4 rounded-2xl border-red-500 text-red-500 hover:bg-red-50"
              >
                <span className="font-medium">Sair</span>
                <LogOutIcon className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="default" className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-2xl border-verde-claro">
              <Link to="/login" aria-label="Ir para login" className="inline-flex items-center gap-2">
                <span className="font-[number:var(--bot-es-font-weight)] text-verde-claro text-[length:var(--bot-es-font-size)] text-center leading-[var(--bot-es-line-height)] whitespace-nowrap font-bot-es tracking-[var(--bot-es-letter-spacing)] [font-style:var(--bot-es-font-style)]">
                  Fazer login
                </span>
                <UserIcon className="w-6 h-6 text-verde-claro" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="w-full h-[70px] bg-verde-escuro flex items-center justify-center">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex items-center justify-center gap-0 w-full">
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className="inline-flex h-8 items-center justify-center gap-2.5 px-4 py-2.5"
                  >
                    <div className="font-bold text-fundo-claro text-2xl text-center leading-[normal] [font-family:'Montserrat',Helvetica] tracking-[0]">
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
