import { create } from 'zustand';

type InvoicePageState = {
  search?: string;
  filter: 'all' | 'paid' | 'pending' | 'separated' | 'canceled';
  filtersIsOpen: boolean;
  generalFormIsOpen: boolean;
  counterFormIsOpen: boolean;
  invoiceIdToShow?: string;
  invoiceIdToPrint?: string;
};

type InvoicePageActions = {
  updateSearch: (search?: string) => void;
  toggleFilters: (value?: boolean) => void;
  updateFilter: (filter: InvoicePageState['filter']) => void;
  resetState: () => void;
  showGeneralForm: () => void;
  hideGeneralForm: () => void;
  showCounterForm: () => void;
  hideCounterForm: () => void;
  mountInvoiceToShow: (invoiceId: string) => void;
  unmountInvoiceToShow: () => void;
  showPrinterModal: (invoiceId: string) => void;
  hidePrinterModal: () => void;
};

export const useInvoicePageStore = create<InvoicePageState & InvoicePageActions>((set, get) => ({
  search: undefined,
  filter: 'all',
  filtersIsOpen: false,
  generalFormIsOpen: false,
  counterFormIsOpen: false,
  invoiceIdToShow: undefined,
  updateSearch(search) {
    set({ search });
  },
  toggleFilters(value) {
    const hasValue = typeof value === 'boolean';
    set(state => ({ filtersIsOpen: hasValue ? value : !state.filtersIsOpen }));
  },
  updateFilter(filter) {
    set({ filter });
  },
  resetState() {
    set({ search: undefined, filter: 'all', filtersIsOpen: false });
  },
  showGeneralForm() {
    set({ generalFormIsOpen: true });
  },
  hideGeneralForm() {
    set({ generalFormIsOpen: false });
  },
  showCounterForm() {
    set({ counterFormIsOpen: true });
  },
  hideCounterForm() {
    set({ counterFormIsOpen: false });
  },
  mountInvoiceToShow(invoiceId) {
    set({ invoiceIdToShow: invoiceId });
  },
  unmountInvoiceToShow() {
    set({ invoiceIdToShow: undefined });
  },
  showPrinterModal(invoiceId) {
    set({ invoiceIdToPrint: invoiceId });
  },
  hidePrinterModal() {
    set({ invoiceIdToPrint: undefined });
  },
}));
