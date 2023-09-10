import type { IAuthActions, IAuthState } from '@/types';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { clearAuthToken, saveAuthToken } from '@/logic/auth-logic';

export const useAuthStore = createWithEqualityFn<IAuthState & IAuthActions>()(
  (set, get) => ({
    user: undefined,
    isAuth: false,
    isAdmin: false,
    saveCredentials({ user, token }) {
      set(state => ({ user, isAuth: true, isAdmin: user.role === 'admin' }));
      saveAuthToken(token);
    },
    clearCredentials() {
      set(state => ({ user: undefined, isAuth: false, isAdmin: false }));
      clearAuthToken();
    },
    updateUser(user) {
      set(state => ({ user: user, isAuth: true, isAdmin: user.role === 'admin' }));
    },
  }),
  shallow,
);
