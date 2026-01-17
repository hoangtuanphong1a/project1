// export interface ILoginResponse {
//   token: string;
//   refreshToken: string;
//   tokenExpires: number;
//   user: IUser;
// }

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}
export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ILogoutResponse {
  message: string;
}

export type IUserResponse = IUser;

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUser {
  id: string;
  email: string;
  full_name: string;
  userName: string;
  avatar_url?: string;
  role: UserRole;
}
