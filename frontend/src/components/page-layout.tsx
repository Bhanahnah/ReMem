import React from "react";
import { Container } from "react-bootstrap";

import { NavBar } from "./navigation/navbar";

interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  return (
    <Container fluid className="px-0">
      <NavBar />
      {children}
    </Container>
  );
};
