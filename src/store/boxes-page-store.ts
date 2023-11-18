import { create } from 'zustand';

type boxesPageState = {
  formIsOpen: boolean;
  infoIsOpen: boolean;
  transactionFormIsOpen: boolean;
  boxToUpdate?: string;
  boxToDelete?: string;
  boxToInfo?: string;
  mainBoxIsSelected: boolean;
  boxToOpen?: string;
  boxToClose?: string;
  transactionToDelete?: string;
};

type boxesPageActions = {
  showForm: (boxId?: string) => void;
  hideForm: () => void;
  showDeleteBoxAlert: (boxId: string) => void;
  hideDeleteBoxAlert: () => void;
  mountBoxToPayment: (boxId: string) => void;
  mountBoxToInfo: (boxId: string) => void;
  mountMainBoxToInfo: () => void;
  unmountBoxToInfo: () => void;
  mountBoxToOpen: (boxId: string) => void;
  unmountBoxToOpen: () => void;
  mountBoxToClose: (boxId: string) => void;
  unmountBoxToClose: () => void;
  showTransactionForm: () => void;
  hideTransactionForm: () => void;
  mountTransactionToDelete: (tId: string) => void;
  unmountTransactionToDelete: () => void;
};

export const useBoxesPageStore = create<boxesPageState & boxesPageActions>((set, get) => ({
  formIsOpen: false,
  infoIsOpen: false,
  transactionFormIsOpen: false,
  boxToUpdate: undefined,
  boxToDelete: undefined,
  boxToOpen: undefined,
  mainBoxIsSelected: false,
  showForm(boxId) {
    set({ formIsOpen: true, boxToUpdate: boxId });
  },
  hideForm() {
    set({ formIsOpen: false, boxToUpdate: undefined });
  },
  showDeleteBoxAlert(boxId) {
    set({ boxToDelete: boxId });
  },
  hideDeleteBoxAlert() {
    set({ boxToDelete: undefined });
  },
  mountBoxToPayment(boxId) {
    set({ boxToInfo: boxId });
  },
  mountBoxToInfo(boxId) {
    set({ boxToInfo: boxId, infoIsOpen: true, mainBoxIsSelected: false });
  },
  mountMainBoxToInfo() {
    set({ mainBoxIsSelected: true, infoIsOpen: true, boxToInfo: undefined });
  },
  unmountBoxToInfo() {
    set({ boxToInfo: undefined, mainBoxIsSelected: false, infoIsOpen: false });
  },
  mountBoxToOpen(boxId) {
    set({ boxToOpen: boxId });
  },
  unmountBoxToOpen() {
    set({ boxToOpen: undefined });
  },
  mountBoxToClose(boxId) {
    set({ boxToClose: boxId });
  },
  unmountBoxToClose() {
    set({ boxToClose: undefined });
  },
  showTransactionForm() {
    set({ transactionFormIsOpen: true });
  },
  hideTransactionForm() {
    set({ transactionFormIsOpen: false });
  },
  mountTransactionToDelete(transaction) {
    set({ transactionToDelete: transaction });
  },
  unmountTransactionToDelete() {
    set({ transactionToDelete: undefined });
  },
}));
