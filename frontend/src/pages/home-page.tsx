import React from "react";
import { Auth0Features } from "src/components/auth0-features";
import { HeroBanner } from "src/components/hero-banner";
import { PageLayout } from "../components/page-layout";

export const HomePage: React.FC = () => (
  <PageLayout>
    <>
      <h3 className="position-absolute top-50 start-50 translate-middle">
        You must be logged in to use this app {":)"}
      </h3>
    </>
  </PageLayout>
);
