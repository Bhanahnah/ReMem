// Premade Auth0 setup, unsure when to get rid of
export interface AppError {
  message: string;
}

// Premade Auth0 setup, unsure when to get rid of
export interface Message {
  text: string;
}

export interface MondoDBObj {
  id: string;
}

export interface UserInfo {
  authid: string;
  name: string;
  email: string;
}

export interface UserInfoResponse extends UserInfo, MondoDBObj {
  created_dt: Date | null;
}

export interface GetCreateResponse extends UserInfoResponse {
  desc?: string;
  created?: boolean;
  data?: Message;
  error?: AppError;
}

export interface ApiResponse {
  data: Message | null;
  error: AppError | null;
}

export interface UserInfoPayload extends UserInfo {}

export interface Auth0UserProfile {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
}

export function setUserInfoPayload(
  user: Auth0UserProfile | undefined
): UserInfoPayload | null {
  return user
    ? {
        authid: user.sub,
        name: user.name,
        email: user.email,
      }
    : null;
}
