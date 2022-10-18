import { IAction, IInvoicePageState } from 'types';
import * as actions from './actions';

const initialState: IInvoicePageState = {
  invoices: [],
  customers: [],
  categories: [],
  products: [],
  cashboxs: [],
  formOpened: true,
};

export default function InvoicePageReducer(state = initialState, action: IAction): IInvoicePageState {
  switch (action.type) {
    case actions.MOUNT_DATA: {
      return { ...state, ...(action.payload as object) };
    }
    default: {
      return state;
    }
  }
}
