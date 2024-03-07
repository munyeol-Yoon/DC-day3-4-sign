export type Payload = {
  sub: string;
  iat: number;
  jti: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AccessToken = {
  accessToken: string;
};

export type RefreshToken = {
  refreshToken: string;
};
