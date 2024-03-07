export type Payload = {
  sub: string;
  iat: number;
  jti: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
