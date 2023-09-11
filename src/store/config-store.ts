import { create } from 'zustand';

export interface IConfigState {
  showSensitiveInformation: boolean;
}

export interface IConfigActions {
  blockSesitiveInformation: () => void;
  unlockSensitiveInformation: (password: string) => void;
}

export const useConfigStore = create<IConfigState & IConfigActions>()((set, get) => ({
  showSensitiveInformation: false,
  blockSesitiveInformation() {
    set(state => ({ showSensitiveInformation: false }));
  },
  unlockSensitiveInformation(password) {
    set(state => ({ showSensitiveInformation: password === 'contraseña' }));
  },
}));
