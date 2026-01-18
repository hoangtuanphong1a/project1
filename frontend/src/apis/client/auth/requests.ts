import { useUserStore } from '@/stores/userStore';

import { LoginSchemaType, RegisterSchemaType } from '@/lib/validations/auth-client';

import { request } from '@/apis/axios';
import { KEYS } from './keys';
import { ILoginResponse, ILogoutResponse, IRefreshTokenResponse, IRegisterResponse, IUserResponse, IUser, UserRole } from './types';

export const AuthService = {
  me: async (): Promise<IUserResponse> => {
    const response = await request.get<any>(KEYS.AUTH_ME);

    // Transform backend response to match IUser interface
    const userData: IUser = {
      id: response.data.id,
      email: response.data.email,
      full_name: response.data.displayName || response.data.display_name || '',
      userName: response.data.username || response.data.userName || '',
      avatar_url: response.data.avatarUrl || response.data.avatar_url,
      role: UserRole.USER, // Default role, can be updated based on actual roles later
    };

    const { setUser } = useUserStore.getState();
    setUser(userData);

    return userData;
  },

  login: async (data: LoginSchemaType): Promise<ILoginResponse> => {
    const response = await request.post<ILoginResponse>(KEYS.AUTH_LOGIN, {
      email: data.email,
      password: data.password
    });
console.log(response);

    return response.data;
  },

  register: async (data: RegisterSchemaType): Promise<IRegisterResponse> => {
    const payload = {
      email: data.email,
      password: data.password,
      fullName: `${data.firstName} ${data.lastName}`
    };
    console.log('📤 Frontend register request:', payload);
    try {
      const response = await request.post<IRegisterResponse>(KEYS.AUTH_REGISTER, payload);
      console.log('✅ Frontend register success:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Frontend register error:', error);
      throw error;
    }
  },

  refreshToken: async (): Promise<IRefreshTokenResponse> => {
    const response = await request.post<IRefreshTokenResponse>(KEYS.AUTH_REFRESH_TOKEN, {});
    const { setTokens } = useUserStore.getState();
    setTokens(response.data);
    return response.data;
  },

  logout: async (userId: string): Promise<ILogoutResponse> => {
    const response = await request.post<ILogoutResponse>(KEYS.AUTH_LOGOUT(userId));
    return response.data;
  },
};
