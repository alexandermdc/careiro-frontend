import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { MainContentSection } from "./sections/MainSections";


export const Feiras= (): React.ReactElement => {
  return (
    <PageLayout>
      { <MainContentSection /> }
    </PageLayout>
  );
};
