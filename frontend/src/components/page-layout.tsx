import React from "react";
import { Container } from "react-bootstrap";

import { PageFooter } from "./page-footer";
import { NavBar } from "./navigation/navbar";

interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  return (
    <Container fluid>
      <NavBar />
      {children}
    </Container>
  );
};
