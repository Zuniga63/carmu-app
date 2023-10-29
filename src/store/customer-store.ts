import { create } from 'zustand';

type CustomerPageState = {
  formIsOpen: boolean;
  customerToUpdate?: string;
  customerToDelete?: string;
  customerToPayment?: string;
  customerToInfo?: string;
};

type CustomerPageActions = {
  showForm: (customerId?: string) => void;
  hideForm: () => void;
  showDeleteCustomerAlert: (customerId: string) => void;
  hideDeleteCustomerAlert: () => void;
  mountCustomerToPayment: (customerId: string) => void;
  unmountCustomerToPayment: () => void;
  mountCustomerToInfo: (customerId: string) => void;
  unmoutCustomerToInfo: () => void;
};

export const useCustomerPageStore = create<CustomerPageState & CustomerPageActions>()((set, get) => ({
  formIsOpen: false,
  customerToUpdate: undefined,
  showForm(customerId) {
    set({ formIsOpen: true, customerToUpdate: customerId });
  },
  hideForm() {
    set({ formIsOpen: false, customerToUpdate: undefined });
  },
  showDeleteCustomerAlert(customerId) {
    set({ customerToDelete: customerId });
  },
  hideDeleteCustomerAlert() {
    set({ customerToDelete: undefined });
  },
  mountCustomerToPayment(customerId) {
    set({ customerToPayment: customerId });
  },
  unmountCustomerToPayment() {
    set({ customerToPayment: undefined });
  },
  mountCustomerToInfo(customerId) {
    set({ customerToInfo: customerId });
  },
  unmoutCustomerToInfo() {
    set({ customerToInfo: undefined });
  },
}));
