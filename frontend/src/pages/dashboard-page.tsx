import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";
import DisplayObj from "src/components/utils";
import {
  getProtectedResource,
  getCreateUpdateUserInfo,
} from "../services/message.service";

import {
  UserInfoPayload,
  Auth0UserProfile,
  setUserInfoPayload,
  GetCreateResponse,
} from "src/models/api-models";

export const DashboardPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const [userInfo, setUserInfo] = useState<GetCreateResponse | null>(null);

  const { getAccessTokenSilently, user } = useAuth0<Auth0UserProfile>();

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

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Dashboard
        </h1>
        <div className="content__body">
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
        </div>
      </div>
    </PageLayout>
  );
};
