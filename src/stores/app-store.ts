import { User } from '@/modules/auth/interfaces';
import { create } from 'zustand';

export interface AppState {
  user: User | null;
  accessToken: string | null;
  oldAccessToken: string | null;
}

export interface AppStateActions {
  setUser: (user: User | null) => void;
  setCredentials: (credentials: { accessToken: string; oldAccessToken: string }) => void;
  clearCredentials: () => void;
}

export const useAppStore = create<AppState & AppStateActions>()((set, get) => ({
  user: null,
  accessToken: null,
  oldAccessToken: null,
  setUser(user) {
    set(() => ({ user }));
  },
  setCredentials(credentials) {
    set(() => ({ accessToken: credentials.accessToken, oldAccessToken: credentials.oldAccessToken }));
  },
  clearCredentials() {
    set(() => ({ accessToken: null, oldAccessToken: null }));
  },
}));
