import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";
import DisplayObj from "src/components/utils";
import {
  // getProtectedResource,
  getCreateUpdateUserInfo,
} from "../services/message.service";

import {
  UserInfoPayload,
  Auth0UserProfile,
  setUserInfoPayload,
  GetCreateResponse,
} from "src/models/api-models";

import {
  WebChatContainer,
  setEnableDebug,
  WebChatConfig,
  WebChatInstance,
} from "@ibm-watson/assistant-web-chat-react";

import ExData from "src/components/ex_data";

const webChatOptions: WebChatConfig = {
  integrationID: window._env_.WATSONX_INTEGRATION_ID ?? "none",
  // @ts-ignore
  region: window._env_.WATSONX_REGION ?? "local",
  serviceInstanceID: window._env_.WATSONX_SERVICE_INSTANCE_ID ?? "none",
  openChatByDefault: true,
  // subscriptionID: 'only on enterprise plans',
  // Note that there is no onLoad property here. The WebChatContainer component will override it.
  // Use the onBeforeRender or onAfterRender prop instead.
};

// Include this if you want to get debugging information from this library. Note this is different than
// the web chat "debug: true" configuration option which enables debugging within web chat.
setEnableDebug(true);

export const DashboardPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [userInfo, setUserInfo] = useState<GetCreateResponse | null>(null);
  const { getAccessTokenSilently, user } = useAuth0<Auth0UserProfile>();
  const [chatInstance, setChatInstance] = useState<WebChatInstance | null>(
    null
  );

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
        setMessage(JSON.stringify(response, null, 2));
        setUserInfo(response);
      }
    };

    getMessage();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently, user]);

  useEffect(() => {
    chatInstance?.restartConversation();

    /// Cleanup function?
    return () => {
      chatInstance?.destroySession();
    };
  }, [chatInstance]);

  function onChatBeforeRender(i: WebChatInstance): Promise<void> {
    // Do any other work you might want to do before rendering. If you don't need any other work here, you can just use
    // onBeforeRender={setInstance} in the component above.
    return new Promise<void>(() => {
      // Make the instance available to the React components.
      setChatInstance(i);
    });
  }

  return (
    <PageLayout>
      <Container>
        <Col>
          <h1>Dashboard</h1>
          <ExData></ExData>

          {/* <div className="content__body">
            {userInfo ? (
              <DisplayObj data={userInfo} title="User Info" />
            ) : (
              <p>Loading user information...</p>
            )}
            {user ? (
              <DisplayObj data={user} title="Auth0 User Info" />
            ) : (
              <p>Loading Auth0 user information...</p>
            )}
            <CodeSnippet title="Protected Message" code={message} />
          </div> */}
        </Col>
        <Col>
          <WebChatContainer
            config={webChatOptions}
            onAfterRender={(i) => onChatBeforeRender(i)}
          />
        </Col>
      </Container>
    </PageLayout>
  );
};
