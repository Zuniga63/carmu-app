import { IAction, IInvoicePageState } from 'types';
import * as actions from './actions';

const initialState: IInvoicePageState = {
  invoices: [],
  customers: [],
  categories: [],
  products: [],
  cashboxs: [],
  formOpened: false,
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
    default: {
      return state;
    }
  }
}
