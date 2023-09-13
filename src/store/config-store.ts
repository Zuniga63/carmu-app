import { PREMISE_STORE_KEY } from '@/config/constants';
import { IPremiseStore } from '@/types';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export interface IConfigState {
  premiseStore?: IPremiseStore;
  premiseStoreFormOpened: boolean;
  premiseStoreIdToUpdate?: string;
  showSensitiveInformation: boolean;
}

export interface IConfigActions {
  blockSesitiveInformation: () => void;
  unlockSensitiveInformation: (password: string) => void;
  setPremiseStore: (premiseStore?: IPremiseStore) => void;
  showPremiseStoreForm: (premiseStoreIdToUpdate?: string) => void;
  hidePremiseStoreForm: () => void;
}

export const useConfigStore = createWithEqualityFn<IConfigState & IConfigActions>()(
  (set, get) => ({
    // --------------------------------------------------------------------------
    // PREMISE STORE CONFIG
    // --------------------------------------------------------------------------
    premiseStore: undefined,
    premiseStoreFormOpened: false,
    premiseStoreIdToUpdate: undefined,
    setPremiseStore(premiseStore) {
      if (premiseStore) localStorage.setItem(PREMISE_STORE_KEY, premiseStore.id);
      else localStorage.removeItem(PREMISE_STORE_KEY);
      set(() => ({ premiseStore }));
    },
    showPremiseStoreForm(premiseStoreIdToUpdate) {
      set(() => ({ premiseStoreIdToUpdate, premiseStoreFormOpened: true }));
    },
    hidePremiseStoreForm() {
      set(() => ({ premiseStoreIdToUpdate: undefined, premiseStoreFormOpened: false }));
    },
    // --------------------------------------------------------------------------
    // SESITIVE INFORMATION
    // --------------------------------------------------------------------------
    showSensitiveInformation: false,
    blockSesitiveInformation() {
      set(state => ({ showSensitiveInformation: false }));
    },
    unlockSensitiveInformation(password) {
      set(state => ({ showSensitiveInformation: password === 'contraseña' }));
    },
  }),
  shallow,
);
