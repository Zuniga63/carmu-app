import type { IAuthActions, IAuthState } from '@/types';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export const useAuthStore = createWithEqualityFn<IAuthState & IAuthActions>()(
  (set, get) => ({
    user: undefined,
    isAuth: false,
    isAdmin: false,
    saveCredentials({ user, token }) {
      set(state => ({ user, isAuth: true, isAdmin: user.role === 'admin' }));
    },
    clearCredentials() {
      set(state => ({ user: undefined, isAuth: false, isAdmin: false }));
    },
    updateUser(user) {
      set(state => ({ user: user, isAuth: true, isAdmin: user.role === 'admin' }));
    },
  }),
  shallow,
);
