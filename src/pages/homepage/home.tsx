import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";

export const Homepage = (): React.ReactElement => {
  return (
    <PageLayout>
      <div className="bg-fundo-claro w-full flex flex-col items-center">
        <img
          className="w-full max-w-[1440px] h-[630px] object-cover"
          alt="Banner Principal"
          src="https://c.animaapp.com/meda5qjaouVHG5/img/group-127.png"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/1200x630/9cb217/ffffff?text=Banner+Agriconnect";
          }}
        />
        <MainContentSection />
      </div>
    </PageLayout>
  );
};
