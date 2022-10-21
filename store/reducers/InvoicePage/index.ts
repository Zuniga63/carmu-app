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
    default: {
      return state;
    }
  }
}
