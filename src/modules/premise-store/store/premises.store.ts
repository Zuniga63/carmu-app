import { create } from 'zustand';

export interface PremisesState {
  showCreatePremiseModal: boolean;
  premiseToEdit?: number;
}

export interface PremisesStateActions {
  setShowCreatePremiseModal: (show: boolean) => void;
  setPremiseToEdit: (id?: number) => void;
}

export const usePremisesStore = create<PremisesState & PremisesStateActions>()((set, get) => ({
  showCreatePremiseModal: false,
  premiseToEdit: undefined,
  setShowCreatePremiseModal(show) {
    set(() => ({ showCreatePremiseModal: show, premiseToEdit: undefined }));
  },
  setPremiseToEdit(id) {
    set(() => ({ premiseToEdit: id, showCreatePremiseModal: false }));
  },
}));
