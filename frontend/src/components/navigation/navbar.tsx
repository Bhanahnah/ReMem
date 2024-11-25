import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

import { LoginButton, LogoutButton, SignupButton } from "../buttons";

import Logo from "./logo";

import {
  Auth0UserProfile,
  GetCreateResponse,
  UserInfoPayload,
  setUserInfoPayload,
} from "src/models/api-models";
import DisplayObj from "src/components/utils";
import { getCreateUpdateUserInfo } from "src/services/message.service";

export const NavBar: React.FC = () => {
  const { isAuthenticated, user, getAccessTokenSilently } =
    useAuth0<Auth0UserProfile>();
  const [userInfo, setUserInfo] = useState<GetCreateResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getMessage = async () => {
      const accessToken = await getAccessTokenSilently();

      const payload: UserInfoPayload | null = setUserInfoPayload(user);

      if (!payload) {
        return;
      }

      const response: GetCreateResponse = await getCreateUpdateUserInfo(
        accessToken,
        payload
      );

      if (!isMounted) {
        return;
      }

      if (response) {
        setUserInfo(response);
      }
    };

    getMessage();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently, user]);

  return (
    <Navbar
      expand="md"
      // className="justify-content-between"
      data-bs-theme="light"
      bg="primary"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand href="/" data-bs-theme="light">
          <Logo width="30" height="30" /> ReMem{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            {!isAuthenticated && (
              <>
                <SignupButton /> <LoginButton />
              </>
            )}
            {isAuthenticated && (
              <NavDropdown
                align={"end"}
                menuVariant="secondary"
                title={
                  <>
                    <Image
                      src={user?.picture}
                      alt="user logo"
                      roundedCircle
                      width="30"
                    />{" "}
                    {user?.nickname}
                  </>
                }
                id="basic-nav-dropdown"
              >
                {userInfo ? (
                  <NavDropdown.Item as="div">
                    <DisplayObj data={userInfo} title="User Info" />
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item as="div">
                    Loading user info...
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item as="div">
                  <LogoutButton />
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
