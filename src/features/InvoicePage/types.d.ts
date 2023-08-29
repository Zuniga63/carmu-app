import { IUser } from '../Auth/types';
import { ErrorResponse, ICustomer } from 'src/types';
import { IProduct } from 'src/types';
import { IBox } from 'src/types';
import { Dayjs } from 'dayjs';
import { IPremiseStore } from '../Config/types';

export type IInvoiceSeller = Pick<IUser, 'name' | 'id'>;

export type IInvoiceCustomer = Pick<
  ICustomer,
  'id' | 'firstName' | 'lastName' | 'fullName' | 'documentNumber' | 'address'
>;

export type IInvoiceCategory = Pick<Category, 'id' | 'name'>;

export type IInvoiceProduct = Omit<IProduct, 'images' | 'isInventoriable' | 'sold' | 'returned'>;

export type IInvoiceCashbox = Pick<IBox, 'id' | 'name' | 'openBox'>;

export interface IInvoiceItemBase {
  id: string;
  categories: string[];
  product?: string;
  productSize?: string;
  productColor?: string;
  tags: string[];
  description: string;
  quantity: number;
  unitValue: number;
  discount?: number;
  amount: number;
  balance?: number;
  cancel: boolean;
  cancelMessage?: string;
}

export interface IInvoicePaymentBase {
  id: string;
  paymentDate: string;
  description?: string;
  amount: number;
  initialPayment: boolean;
  cancel: boolean;
  cancelMessage?: string;
  createdAt: strig;
  updatedAt: string;
}

export interface IInvoiceBase {
  id: string;
  seller?: IInvoiceSeller;
  customer?: IInvoiceCustomer;
  premiseStore?: IPremiseStore;
  isSeparate: boolean;
  prefixNumber: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: string;
  sellerName: string;
  expeditionDate: string;
  expirationDate: string;
  subtotal?: number;
  discount?: number;
  amount: number;
  cash?: number;
  credit?: number;
  cashChange?: number;
  balance?: number;
  cancel?: boolean;
  cancelMessage?: string;
  items?: IInvoiceItemBase[];
  payments?: IInvoicePaymentBase[];
  createdAt: strig;
  updatedAt: string;
}

export type INewInvoiceItem = Omit<IInvoiceItemBase, 'balance' | 'cancel' | 'cancelMessage'>;

export interface INewInvoicePayment {
  id: number;
  box?: IInvoiceCashbox;
  register: boolean;
  description: string;
  amount: number;
}

export interface IInvoiceSummary {
  subtotal: number;
  discount?: number;
  amount: number;
  cash?: number;
  cashChange?: number;
  balance?: number;
}

export interface IInvoicePaymentData {
  invoiceId: string;
  cashboxId?: string;
  paymentDate?: Date;
  description: string;
  amount: number;
  register: boolean;
}

export interface IInvoiceStoreData {
  sellerId?: string;
  customerId?: string;
  premiseStoreId?: string;
  isSeparate: boolean;
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: string;
  sellerName?: string;
  expeditionDate?: Date;
  expirationDate?: Date;
  cash?: number;
  items: Omit<INewInvoiceItem, 'id' | 'amount'>[];
  cashPayments: {
    cashboxId?: string;
    description: string;
    amount: number;
    register: boolean;
  }[];
  registerWithOtherCustomerData: boolean;
}

export interface IInvoiceBaseFull extends IInvoiceBase {
  items: IInvoiceItemBase[];
  payments: IInvoicePaymentBase[];
}

export interface IInvoice extends IInvoiceBase {
  expeditionDate: Dayjs;
  expirationDate: Dayjs;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  search: string;
}

export interface IInvoicePayment extends IInvoicePaymentBase {
  paymentDate: Dayjs;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface IInvoiceFull extends IInvoice {
  items: IInvoiceItemBase[];
  payments: IInvoicePayment[];
}

export interface IInvoicePageData {
  invoices: IInvoiceBase[];
  products: IInvoiceProduct[];
}

export type InvoicePageState = {
  invoices: IInvoiceBase[];
  products: IInvoiceProduct[];
  loading: boolean;
  firstLoading: boolean;
  refreshIsSuccess: boolean;
  // Show invoice
  selectedInvoice: IInvoiceBaseFull | null;
  selectedInvoiceOpened: boolean;
  selectedInvoiceLoading: boolean;
  selectedInvoiceError: string | null;
  // STORE INVOICE
  formOpened: boolean;
  counterSaleFormOpened: boolean;
  storeLoading: boolean;
  storeSuccess: boolean;
  storeError: unknown;
  // STORE PAYMENT
  paymentFormOpened: boolean;
  storePaymentLoading: boolean;
  storePaymentSuccess?: string;
  storePaymentError: ErrorResponse | null;
  // CANCEL PAYMENT
  paymentToCancel?: IInvoicePaymentBase;
  cancelPaymentFormOpened: boolean;
  cancelPaymentLoading: boolean;
  cancelPaymentIsSuccess: boolean;
  cancelPaymentError?: string;
  // CANCEL INVOICE
  cancelInvoiceFormOpened: boolean;
  cancelInvoiceLoading: boolean;
  cancelInvoiceIsSuccess: boolean;
  cancelInvoiceError?: string;
};
