import { AxiosRequestConfig } from "axios";
import { callExternalApi } from "./external-api.service";
import {
  GetCreateResponse,
  ApiResponse,
  UserInfoPayload,
} from "src/models/api-models";

// const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
const apiServerUrl = window._env_.REACT_APP_API_SERVER_URL;

export const getPublicResource = async (): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `/api/messages/public`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    baseURL: apiServerUrl,
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getCreateUpdateUserInfo = async (
  accessToken: string,
  data: UserInfoPayload
): Promise<GetCreateResponse> => {
  const config: AxiosRequestConfig = {
    url: `/api/userinfo/getcreate`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: data,
    baseURL: apiServerUrl,
  };

  const response = (await callExternalApi({
    config,
  })) as GetCreateResponse;

  return { ...response };
};

export const getProtectedResource = async (
  accessToken: string
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages/protected`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getAdminResource = async (
  accessToken: string
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages/admin`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};
