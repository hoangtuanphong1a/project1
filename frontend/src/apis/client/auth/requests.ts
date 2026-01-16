import { useUserStore } from '@/stores/userStore';

import { LoginSchemaType, RegisterSchemaType } from '@/lib/validations/auth-client';

import { request } from '@/apis/axios'; 
import { KEYS } from './keys';
import { ILoginResponse, ILogoutResponse, IRefreshTokenResponse, IRegisterResponse, IUserResponse } from './types';

export const AuthService = {
  me: async (): Promise<IUserResponse> => {
    const response = await request.get<IUserResponse>(KEYS.AUTH_ME);
    const { setUser } = useUserStore.getState();
    setUser(response.data);

    return response.data;
  },

  login: async (data: LoginSchemaType): Promise<ILoginResponse> => {
    const response = await request.post(KEYS.AUTH_LOGIN, data);

    // Transform backend response to match frontend expectations
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      access_token: (response as any).accessToken,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
    };
  },

  register: async (data: RegisterSchemaType): Promise<IRegisterResponse> => {
    const response = await request.post(KEYS.AUTH_REGISTER, {
      email: data.email,
      password: data.password,
      fullName: `${data.firstName} ${data.lastName}`,
    });

    // Transform backend response to match frontend expectations
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessToken: (response as any).accessToken,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refreshToken: (response as any).refreshToken,
    };
  },

  refreshToken: async (): Promise<IRefreshTokenResponse> => {
    const response = await request.post<IRefreshTokenResponse>(KEYS.AUTH_REFRESH_TOKEN, {});
    const { setTokens } = useUserStore.getState();
    setTokens(response.data);
    return response.data;
  },

  logout: async (): Promi