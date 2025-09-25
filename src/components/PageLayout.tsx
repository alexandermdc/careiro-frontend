import React from "react";
import { HeaderSection } from "./HeaderSection";
import { FooterSection } from "./FooterSection";

interface PageLayoutProps {
  children: React.ReactNode;
  footerSections?: Array<{
    title: string;
    links: Array<{ text: string; href: string }>;
  }>;
}

export const PageLayout = ({ children, footerSections }: PageLayoutProps): React.ReactElement => {
  return (
    <div className="bg-fundo-claro w-full min-h-screen flex flex-col">
      <HeaderSection />
      <main className="flex-1">
        {children}
      </main>
      <FooterSection sections={footerSections} />
    </div>
  );
};