import { ErrorResponse } from 'src/types';
import { IInvoiceBaseFull } from '../InvoicePage/types';

export interface ICustomerContact {
  id: string;
  phone: string;
  description?: string;
  createdAt: strig;
  updatedAt: string;
}

export interface ICustomer {
  id: string;
  user?: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  alias?: string;
  observation?: string;
  email?: string;
  contacts: ICustomerContact[];
  address?: string;
  documentType?: string;
  documentNumber?: string;
  birthDate?: string;
  profilePhoto?: IImage;
  invoice: string[];
  balance?: number;
  firstPendingInvoice?: string;
  lastPendingInvoice?: string;
  lastPayment?: string;
  createdAt: strig;
  updatedAt: string;
}

export interface ICustomerWithInvoices extends ICustomer {
  invoices: IInvoiceBaseFull[];
}

export interface ICustomerStore {
  id?: string;
  firstName: string;
  lastName?: string;
  alias?: string;
  observation?: string;
  email?: string;
  address?: string;
  documentType?: string;
  documentNumber?: string;
  birthDate?: string;
  contacts: {
    phone: string;
    description: string;
  }[];
}

export type CustomerPageState = {
  customers: ICustomer[];
  fetchLoading: boolean;
  fetchIsSuccess: boolean;
  fetchError: boolean;
  firstFetchLoading: boolean;
  // --------------------------------------------------------------------------
  // STORE CUSTOMER
  // --------------------------------------------------------------------------
  customerToUpdate?: ICustomer;
  customerFormOpened: boolean;
  customerFormIsLoading: boolean;
  customerFormIsSuccess: boolean;
  customerFormError: ErrorResponse | null;
  // --------------------------------------------------------------------------
  // FETCH CUSTOMER
  // --------------------------------------------------------------------------
  customer?: ICustomerWithInvoices;
  fetchCustomerId?: string;
  fetchCustomerError?: string;
  // --------------------------------------------------------------------------
  // PAYMENT FORM
  // --------------------------------------------------------------------------
  customerToPayment?: ICustomer;
  paymentFormOpened: boolean;
  paymentFormLoading: boolean;
  paymentFormIsSuccess: boolean;
  paymnerFormError: ErrorResponse | null;
};
