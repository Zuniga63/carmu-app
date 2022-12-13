import { IAction, IInvoice, IInvoiceFull, IInvoicePageState } from 'types';
import * as ACTIONS from './actions';

const initialState: IInvoicePageState = {
  invoices: [],
  customers: [],
  categories: [],
  products: [],
  cashboxs: [],
  loading: true,
  refreshIsSuccess: false,
  // Show invoice
  selectedInvoice: null,
  selectedInvoiceOpened: false,
  selectedInvoiceLoading: false,
  selectedInvoiceError: null,
  // STORE NEW INVOICE
  formOpened: false,
  counterSaleFormOpened: false,
  storeLoading: false,
  storeSuccess: false,
  storeError: null,
  // STORE PAYMENT
  paymentFormOpened: true,
  storePaymentLoading: false,
  storePaymentSuccess: undefined,
  storePaymentError: null,
};

export default function InvoicePageReducer(state = initialState, action: IAction): IInvoicePageState {
  switch (action.type) {
    case ACTIONS.MOUNT_DATA: {
      return { ...state, ...(action.payload as object) };
    }
    case ACTIONS.FORM_NEW_INVOICE_OPENED: {
      return {
        ...state,
        formOpened: action.payload as boolean,
      };
    }
    case ACTIONS.COUNTER_SALE_FORM_OPENED: {
      return { ...state, counterSaleFormOpened: action.payload as boolean };
    }
    case ACTIONS.INVOICE_STORE_LOADING: {
      return { ...state, storeLoading: action.payload as boolean };
    }
    case ACTIONS.INVOICE_STORE_SUCCESS: {
      return { ...state, storeSuccess: action.payload as boolean };
    }
    case ACTIONS.INVOICE_STORE_ERROR: {
      return { ...state, storeError: action.payload };
    }
    case ACTIONS.ADD_NEW_INVOICE: {
      const newInvoice = action.payload as IInvoice;
      return {
        ...state,
        invoices: [...state.invoices, newInvoice],
      };
    }
    case ACTIONS.LOADING_DATA: {
      return { ...state, loading: action.payload as boolean };
    }
    case ACTIONS.REFRESH_IS_SUCCESS: {
      return { ...state, refreshIsSuccess: action.payload as boolean };
    }
    // ------------------------------------------------------------------------
    // CASES RELATED WITH SELECTED INVOICE
    // ------------------------------------------------------------------------
    case ACTIONS.SELECTED_INVOICE_OPENED: {
      return { ...state, selectedInvoiceOpened: Boolean(action.payload) };
    }
    case ACTIONS.SELECTED_INVOICE_LOADING: {
      return { ...state, selectedInvoiceLoading: Boolean(action.payload) };
    }
    case ACTIONS.SELECTED_INVOICE_ERROR: {
      return { ...state, selectedInvoiceError: action.payload ? (action.payload as string) : null };
    }
    case ACTIONS.MOUNT_SELECTED_INVOICE: {
      return { ...state, selectedInvoice: action.payload as IInvoiceFull };
    }
    case ACTIONS.UNMOUNT_SELECTED_INVOICE: {
      return { ...state, selectedInvoice: null };
    }
    case ACTIONS.PAYMENT_FORM_OPENED: {
      return { ...state, paymentFormOpened: action.payload as boolean };
    }
    case ACTIONS.PAYMENT_STORE_LOADING: {
      return { ...state, storePaymentLoading: action.payload as boolean };
    }
    case ACTIONS.PAYMENT_STORE_SUCCESS: {
      return { ...state, storePaymentSuccess: action.payload as string | undefined };
    }
    case ACTIONS.PAYMENT_STORE_ERROR: {
      return { ...state, storePaymentError: action.payload };
    }
    case ACTIONS.ADD_PAYMENT_TO_INVOICE: {
      const newInvoice = action.payload as IInvoiceFull;

      // Find and replace the old invoice
      const list = state.invoices.slice();
      const index = list.findIndex(item => item.id === newInvoice.id);
      if (index >= 0) list.splice(index, 1, newInvoice);

      return { ...state, invoices: list, selectedInvoice: newInvoice };
    }
    default: {
      return state;
    }
  }
}
