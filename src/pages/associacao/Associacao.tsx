import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { MainContentSection } from "./Sections/MainSections";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "../../components/button";
import { PlusIcon } from "lucide-react";

export const Associacao = (): React.ReactElement => {
  const { isAuthenticated, user } = useAuth();

  return (
    <PageLayout>
      {/* Banner de funcionalidades para usuários logados */}
      {isAuthenticated && (
        <div className="bg-verde-claro/10 border-l-4 border-verde-escuro p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-verde-escuro mb-2">
                Olá, {user?.nome}! 
              </h3>
              <p className="text-texto">
                Como usuário logado, você pode criar e gerenciar suas próprias associações.
              </p>
            </div>
            <Button asChild className="bg-verde-escuro hover:bg-verde-claro text-white">
              <Link to="/dashboard" className="inline-flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Criar Associação
              </Link>
            </Button>
          </div>
        </div>
      )}

      <MainContentSection />

      {/* Call to action para usuários não logados */}
      {!isAuthenticated && (
        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quer criar sua própria associação?
          </h3>
          <p className="text-gray-600 mb-6">
            Registre-se na plataforma e comece a gerenciar suas associações hoje mesmo!
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="border-verde-claro text-verde-escuro">
              <Link to="/cadastro">Criar Conta</Link>
            </Button>
            <Button asChild className="bg-verde-escuro hover:bg-verde-claro text-white">
              <Link to="/login">Fazer Login</Link>
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
