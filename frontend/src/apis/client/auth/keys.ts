export const KEYS = {
  AUTH_ME: '/users/me',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_REFRESH_TOKEN: '/auth/refresh',
  AUTH_LOGOUT: (userId: string) => `/auth/logout/${userId}`,
} as const;
