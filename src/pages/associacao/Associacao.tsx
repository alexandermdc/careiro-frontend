import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { AssociacoesListSection } from "./Sections/AssociacoesListSection";

export const Associacao = (): React.ReactElement => {
  
  return (
    <PageLayout>
      <AssociacoesListSection />
    </PageLayout>
  );
};
