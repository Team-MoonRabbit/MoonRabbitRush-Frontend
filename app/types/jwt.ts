export interface JwtResponse {
  accessToken: string;
  accessTokenExpiredAt: string;
  refreshToken: string;
  refreshTokenExpiredAt: string;
}
