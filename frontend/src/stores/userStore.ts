// @/stores/userStore.ts
import { IUser} from '@/apis/client/auth/types';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

// Helper functions for localStorage
const getLocalStorageValue = (key: string): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};



const setLocalStorageValue = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    console.warn('Failed to set localStorage:', key);
  }
};

const removeLocalStorageValue = (key: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn('Failed to remove localStorage:', key);
  }
};

// Khởi tạo từ localStorage
const initialAccess = getLocalStorageValue('accessToken');
const initialRefreshToken = getLocalStorageValue('refreshToken');

const initialUserJson = getLocalStorageValue('userData');
const initialUser: IUser | null = initialUserJson ? JSON.parse(initialUserJson) : null;

interface UserState {
  user: IUser | null;
  accessToken: string;
  refreshToken: string;

  setUser: (u: IUser) => void;
  setTokens: (data: { accessToken: string; refreshToken: string}) => void;
  clearUser: () => void;
}

const useUserBaseStore = create<UserState>()((set, get) => ({
  user: initialUser,
  accessToken: initialAccess,
  refreshToken: initialRefreshToken,

  // CHỈ LƯU USER → role nằm trong user
  setUser: (u) => {
    set({ user: u });
    setLocalStorageValue('userData', JSON.stringify(u));
  },

  setTokens: ({ accessToken, refreshToken }) => {
    console.log('setTokens called with:', { accessToken, refreshToken });
    console.log('accessToken type:', typeof accessToken);
    console.log('refreshToken type:', typeof refreshToken);

    if (!accessToken || !refreshToken) {
      console.error('setTokens called with undefined tokens!');
      return;
    }

    set({
      accessToken: accessToken,
      refreshToken: refreshToken
    });

    // Sync to localStorage
    setLocalStorageValue('accessToken', accessToken);
    setLocalStorageValue('refreshToken', refreshToken);
  },

  clearUser: () => {
    set({
      user: null,
      accessToken: '',
      refreshToken: '',
    });

    // Clear localStorage
    removeLocalStorageValue('accessToken');
    removeLocalStorageValue('refreshToken');
    removeLocalStorageValue('userData');
  },
}));

// ĐỒNG BỘ localStorage KHI STORE THAY ĐỔI
useUserBaseStore.subscribe((state, prevState) => {
  // Token
  if (state.accessToken !== prevState.accessToken) {
    if (state.accessToken) {
      setLocalStorageValue("accessToken", state.accessToken);
    } else {
      removeLocalStorageValue("accessToken");
    }
  }

  if (state.refreshToken !== prevState.refreshToken) {
    if (state.refreshToken) {
      setLocalStorageValue("refreshToken", state.refreshToken);
    } else {
      removeLocalStorageValue("refreshToken");
    }
  }

  // User object
  if (state.user !== prevState.user) {
    if (state.user) {
      setLocalStorageValue("userData", JSON.stringify(state.user));
    } else {
      removeLocalStorageValue("userData");
    }
  }
});


export const useUserStore = createSelectorHooks(useUserBaseStore);
