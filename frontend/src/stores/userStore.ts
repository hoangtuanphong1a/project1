// @/stores/userStore.ts
import { IUser} from '@/apis/client/auth/types';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { create } from 'zustand';

const getCookieValue = (key: string): string => {
  const value = getCookie(key);
  return typeof value === 'string' ? value : '';
};

// Khởi tạo từ cookie
const initialAccess = getCookieValue('accessToken');
const initialRefreshToken = getCookieValue('refreshToken');

const initialUserJson = getCookieValue('userData');
const initialUser: IUser | null = initialUserJson ? JSON.parse(initialUserJson) : null;

interface UserState {
  user: IUser | null;
  accessToken: string;
  refreshToken: string;

  setUser: (u: IUser) => void;
  setTokens: (data: { accessToken: string; refreshToken: string}) => void;
  clearUser: () => void;
}

const useUserBaseStore = create<UserState>()((set) => ({
  user: initialUser,
  accessToken: initialAccess,
  refreshToken: initialRefreshToken,

  // CHỈ LƯU USER → role nằm trong user
  setUser: (u) => {
    set({ user: u });
    setCookie('userData', JSON.stringify(u));
  },

  setTokens: ({ accessToken, refreshToken }) => {
    
    set({
      accessToken: accessToken,
      refreshToken: refreshToken
    });
    setCookie('accessToken', accessToken);
    setCookie('refreshToken', refreshToken);
  },

  clearUser: () => {
    set({
      user: null,
      accessToken: '',
      refreshToken: '',
    });
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
  },
}));

// ĐỒNG BỘ COOKIE KHI STORE THAY ĐỔI
useUserBaseStore.subscribe((state, prevState) => {
  // Token
  if (state.accessToken !== prevState.accessToken) {
    if (state.accessToken) {
      setCookie("accessToken", state.accessToken);
    } else {
      deleteCookie("accessToken");
    }
  }

  if (state.refreshToken !== prevState.refreshToken) {
    if (state.refreshToken) {
      setCookie("refreshToken", state.refreshToken);
    } else {
      deleteCookie("refreshToken");
    }
  }

  // User object
  if (state.user !== prevState.user) {
    if (state.user) {
      setCookie("userData", JSON.stringify(state.user));
    } else {
      deleteCookie("userData");
    }
  }
});


export const useUserStore = createSelectorHooks(useUserBaseStore);