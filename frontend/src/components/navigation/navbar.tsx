import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import { Modal, ModalProps } from "react-bootstrap";

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

const AboutModal: React.FC<ModalProps> = ({
  show,
  onHide,
  onShow,
  ...props
}) => (
  <Modal
    id="about"
    centered
    size="lg"
    autoFocus
    show={show}
    onHide={onHide}
    onShow={onShow}
    {...props}
  >
    <Modal.Header closeButton>
      <Modal.Title>About ReMem</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {" "}
      <h6 style={{ textAlign: "center" }}>
        <b>Created By:</b> Bhavana Jonnalagadda
      </h6>
      <p>
        ReMem aims to work as a second memory. Upload or input "memories", or
        records of anything about your life; the text can be
        <strong> ANYTHING </strong>, as long as it has an identifiable date.
        From there, you can query your memory and "remember" using our smart
        generative AI.
      </p>
      <p>Using your memories data, you can ask for:</p>
      <ul>
        <li>
          <strong>Summaries</strong> of date/time ranges, or of any pattern
        </li>
        <li>
          <strong>Analysis</strong>, reasoning, and identifying patterns
        </li>
        <li>
          <strong>Potential generation</strong> of new fake memories?!
        </li>
        <li>
          <strong>Extracting key values</strong> from your data
        </li>
        <li>
          <strong>Answering any questions</strong>, in general, about your data
        </li>
      </ul>
      <p>Basically, treat ReMem how you would your own memory!</p>
    </Modal.Body>
    <Modal.Footer style={{ justifyContent: "flex-start" }} as="h6">
      <b>Source Code:</b>{" "}
      <a
        href="https://github.com/Bhanahnah/ReMem"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit the ReMem GitHub Repository
      </a>
    </Modal.Footer>
  </Modal>
);

export const NavBar: React.FC = () => {
  const { isAuthenticated, user, getAccessTokenSilently } =
    useAuth0<Auth0UserProfile>();
  const [userInfo, setUserInfo] = useState<GetCreateResponse | null>(null);
  const [aboutShow, setAboutShow] = useState(false);

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
    <>
      <Navbar
        expand="md"
        // className="mx-0"
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
              <Nav.Link onClick={() => setAboutShow(true)}>About</Nav.Link>
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
      <AboutModal
        show={aboutShow}
        onHide={() => setAboutShow(false)}
        onShow={() => setAboutShow(true)}
      />
    </>
  );
};
