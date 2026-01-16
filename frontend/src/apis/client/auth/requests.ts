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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: { user: any; accessToken: string; refreshToken: string } = await request.post(KEYS.AUTH_LOGIN, data);

    // Transform backend response to match frontend expectations
    // Backend returns: { user, accessToken, refreshToken }
    return {
      access_token: response.accessToken,
      refresh_token: response.refreshToken,
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
    const { refreshToken } = useUserStore.getState();

    // Temporarily use refresh token for this request
    const response: { accessToken: string; refreshToken: string } = await request.post(
      KEYS.AUTH_REFRESH_TOKEN,
      {},
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
        },
      }
    );

    // Backend returns: { accessToken, refreshToken }
    // Transform to match frontend expectations
    const transformedResponse = {
      access_token: response.accessToken,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
    };

    const { setTokens } = useUserStore.getState();
    setTokens({
      ...transformedResponse,
      refresh_token: response.refreshToken
    });
    return transformedResponse;
  },

  logout: async (): Promise<ILogoutResponse> => {
    const response = await request.post<ILogoutResponse>(KEYS.AUTH_LOGOUT);
    return response.data;
  },
};
