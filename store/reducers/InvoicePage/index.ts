import { IAction, IInvoice, IInvoiceFull, IInvoicePageState } from 'types';
import * as actions from './actions';

const initialState: IInvoicePageState = {
  invoices: [],
  customers: [],
  categories: [],
  products: [],
  cashboxs: [],
  invoiceSelected: null,
  loading: false,
  // STORE NEW INVOICE
  formOpened: false,
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
    case actions.MOUNT_DATA: {
      return { ...state, ...(action.payload as object) };
    }
    case actions.FORM_NEW_INVOICE_OPENED: {
      return {
        ...state,
        formOpened: action.payload as boolean,
      };
    }
    case actions.INVOICE_STORE_LOADING: {
      return { ...state, storeLoading: action.payload as boolean };
    }
    case actions.INVOICE_STORE_SUCCESS: {
      return { ...state, storeSuccess: action.payload as boolean };
    }
    case actions.INVOICE_STORE_ERROR: {
      return { ...state, storeError: action.payload };
    }
    case actions.ADD_NEW_INVOICE: {
      const newInvoice = action.payload as IInvoice;
      return {
        ...state,
        invoices: [...state.invoices, newInvoice],
      };
    }
    case actions.LOADING_DATA: {
      return { ...state, loading: action.payload as boolean };
    }
    case actions.MOUNT_SELECTED_INVOICE: {
      return { ...state, invoiceSelected: action.payload as IInvoiceFull };
    }
    case actions.PAYMENT_FORM_OPENED: {
      return { ...state, paymentFormOpened: action.payload as boolean };
    }
    case actions.PAYMENT_STORE_LOADING: {
      return { ...state, storePaymentLoading: action.payload as boolean };
    }
    case actions.PAYMENT_STORE_SUCCESS: {
      return { ...state, storePaymentSuccess: action.payload as string | undefined };
    }
    case actions.PAYMENT_STORE_ERROR: {
      return { ...state, storePaymentError: action.payload };
    }
    case actions.ADD_PAYMENT_TO_INVOICE: {
      const newInvoice = action.payload as IInvoiceFull;

      // Find and replace the old invoice
      const list = state.invoices.slice();
      const index = list.findIndex(item => item.id === newInvoice.id);
      if (index >= 0) list.splice(index, 1, newInvoice);

      return { ...state, invoices: list, invoiceSelected: newInvoice };
    }
    default: {
      return state;
    }
  }
}
