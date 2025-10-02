import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { AssociacoesListSection } from "./Sections/AssociacoesListSection";

export const Associacao = (): React.ReactElement => {
  console.log('🎯 Página Associacao renderizada');
  
  return (
    <PageLayout>
      <AssociacoesListSection />
    </PageLayout>
  );
};
