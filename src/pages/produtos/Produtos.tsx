import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { MainContentSection } from "./Sections/MainSections";


export const Produtos= (): React.ReactElement => {
  return (
    <PageLayout >
      {<MainContentSection /> }
    </PageLayout>
  );
};
