import { SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { type JSX } from "react";
import { Button } from "../../../../components/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/navigate_menu";

const navigationItems = [
  { label: "Início", href: "#" },
  { label: "Produtos", href: "#" },
  { label: "Feiras", href: "#" },
  { label: "Associações", href: "#" },
  { label: "Sobre nós", href: "#" },
];

export const HeaderSection = (): JSX.Element => {
  return (
    <header className="w-full bg-cinza relative">
      <div className="flex items-center justify-between px-[166px] py-[33px]">
        <div className="flex items-center gap-[9px]">
          <img
            className="w-[79px] h-[78px]"
            alt="Captura de tela"
            src="https://c.animaapp.com/meda5qjaouVHG5/img/captura-de-tela-2025-07-31-a-s-22-30-53-1.png"
          />
          <div className="[font-family:'Inter',Helvetica] font-bold text-verde-escuro text-[19px] tracking-[0] leading-[normal]">
            Agriconnect
          </div>
        </div>

        <div className="flex items-center bg-fundo-claro rounded-[30px] border border-solid border-[#d5d7d4] px-6 py-3 w-[487px]">
          <div className="flex-1 [font-family:'Montserrat',Helvetica] font-normal text-texto text-base text-center tracking-[0] leading-[normal]">
            O que você procura?
          </div>
          <SearchIcon className="w-6 h-6 text-texto" />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 p-2">
            <div className="[font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
              Sacola
            </div>
            <ShoppingBagIcon className="w-6 h-6 text-verde-escuro" />
          </div>

          <Button className="h-12 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-fundo-claro rounded-2xl border border-solid border-[#9cb217] hover:bg-fundo-claro">
            <div className="font-[number:var(--bot-es-font-weight)] text-verde-claro text-[length:var(--bot-es-font-size)] text-center leading-[var(--bot-es-line-height)] whitespace-nowrap font-bot-es tracking-[var(--bot-es-letter-spacing)] [font-style:var(--bot-es-font-style)]">
              Fazer login
            </div>
            <UserIcon className="w-6 h-6 text-verde-claro" />
          </Button>
        </div>
      </div>

      <div className="w-full h-[70px] bg-verde-escuro flex items-center justify-center">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex items-center justify-center gap-0 w-full">
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  href={item.href}
                  className="inline-flex h-8 items-center justify-center gap-2.5 px-4 py-2.5"
                >
                  <div className="font-bold text-fundo-claro text-2xl text-center leading-[normal] [font-family:'Montserrat',Helvetica] tracking-[0]">
                    {item.label}
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
