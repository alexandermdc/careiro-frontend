import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { MainContentSection } from "./setions/MainSections";

export const Associacoes = (): React.ReactElement => {
  return (
    <PageLayout>
      {<MainContentSection />}
    </PageLayout>
  );
};
