//-----------------------------------------------------------------------------
// GENERAL TYPES
//-----------------------------------------------------------------------------
export interface IImage {
  publicId: string;
  width: number;
  height: number;
  format: string;
  type: string;
  url: string;
}

export interface IValidationErrors {
  [key?: string]: {
    name: string;
    message: string;
    kind: string;
    path: string;
    value: unknown;
  };
}

export interface IValidationErrorResponse {
  ok: boolean;
  message: string;
  validationErrors: IValidationErrors;
}

export * from 'src/features/Auth/types';
export * from 'src/features/CategoryPage/types';
export * from 'src/features/BoxPage/types';
export * from 'src/features/InvoicePage/types';

//-----------------------------------------------------------------------------
// DASHBOARD PAGE
//-----------------------------------------------------------------------------
export interface ICategoryReport {
  category: {
    id: string;
    mainCategory: string;
    name: string;
    level: number;
    subCategories: string[];
  };
  amount: number;
  tags: [];
}

export interface IDailyReport {
  fromDate: string;
  toDate: string;
  categories: ICategoryReport[];
  tags: [];
  amount: number;
}

export interface IMonthlyReport extends IDailyReport {
  name: string;
  dailyReports: IDailyReport[];
}

export interface IAnnualReport extends IDailyReport {
  year: number;
  monthlyReports: IMonthlyReport[];
}

export interface IDailyCreditEvolution {
  date: string;
  credits: number;
  payments: number;
  balance: number;
}

export interface ICreditEvolutionReport {
  initialBalance: number;
  dailyReports: IDailyCreditEvolution[];
}
//-----------------------------------------------------------------------------
// CUSTOMER
//-----------------------------------------------------------------------------
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

export interface ICustomerStore {
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

//-----------------------------------------------------------------------------
// PRODUCTS
//-----------------------------------------------------------------------------
export interface IProduct {
  id: string;
  categories: string[];
  tags: string[];
  colors: string[];
  sizes: string[];
  name: string;
  slug: string;
  ref?: string;
  barcode?: string;
  description?: string;
  image?: IImage;
  images?: string[];
  isInventoriable: boolean;
  stock: number;
  price: number;
  hasDiscount?: boolean;
  priceWithDiscount?: number;
  productIsNew?: boolean;
  published?: boolean;
  sold?: number;
  returned?: number;
  createdAt: strig;
  updatedAt: string;
}

export interface IProductWithCategories extends IProduct {
  categories: {
    id: string;
    name: string;
  }[];
}

//-----------------------------------------------------------------------------
// INVOICE
//-----------------------------------------------------------------------------
// export type IInvoiceSeller = Pick<IUser, 'name' | 'id'>;
// export type IInvoiceCustomer = Pick<
//   ICustomer,
//   'id' | 'firstName' | 'lastName' | 'fullName' | 'documentNumber' | 'address'
// >;
// export type IInvoiceCategory = Pick<Category, 'id' | 'name'>;
// export type IInvoiceProduct = Omit<
//   IProduct,
//   'images' | 'isInventoriable' | 'sold' | 'returned'
// >;
// export type IInvoiceCashbox = Pick<IBox, 'id' | 'name' | 'openBox'>;

// export interface IInvoiceBase {
//   id: string;
//   seller?: IInvoiceSeller;
//   customer?: IInvoiceCustomer;
//   isSeparate: boolean;
//   prefixNumber: string;
//   customerName: string;
//   customerAddress?: string;
//   customerPhone?: string;
//   customerDocument?: string;
//   customerDocumentType?: string;
//   sellerName: string;
//   expeditionDate: string;
//   expirationDate: string;
//   subtotal?: number;
//   discount?: number;
//   amount: number;
//   cash?: number;
//   credit?: number;
//   cashChange?: number;
//   balance?: number;
//   cancel?: boolean;
//   cancelMessage?: string;
//   createdAt: strig;
//   updatedAt: string;
// }

// export interface IInvoiceItemBase {
//   id: string;
//   categories: string[];
//   product?: string;
//   productSize?: string;
//   productColor?: string;
//   tags: string[];
//   description: string;
//   quantity: number;
//   unitValue: number;
//   discount?: number;
//   amount: number;
//   balance?: number;
//   cancel: boolean;
//   cancelMessage?: string;
// }

// export type INewInvoiceItem = Omit<
//   IInvoiceItemBase,
//   'balance' | 'cancel' | 'cancelMessage'
// >;

// export interface INewInvoicePayment {
//   id: number;
//   box?: IInvoiceCashbox;
//   register: boolean;
//   description: string;
//   amount: number;
// }

// export interface IInvoiceSummary {
//   subtotal: number;
//   discount?: number;
//   amount: number;
//   cash?: number;
//   cashChange?: number;
//   balance?: number;
// }

// export interface IInvoicePaymentData {
//   cashboxId?: string;
//   paymentDate?: Date;
//   description: string;
//   amount: number;
//   register: boolean;
// }

// export interface IInvoiceStoreData {
//   sellerId?: string;
//   customerId?: string;
//   isSeparate: boolean;
//   customerName?: string;
//   customerAddress?: string;
//   customerPhone?: string;
//   customerDocument?: string;
//   customerDocumentType?: string;
//   sellerName?: string;
//   expeditionDate?: Date;
//   expirationDate?: Date;
//   cash?: number;
//   items: Omit<INewInvoiceItem, 'id' | 'amount'>[];
//   cashPayments: {
//     cashboxId?: string;
//     description: string;
//     amount: number;
//     register: boolean;
//   }[];
// }

// export interface IInvoicePaymentBase {
//   id: string;
//   paymentDate: string;
//   description?: string;
//   amount: number;
//   initialPayment: boolean;
//   cancel: boolean;
//   cancelMessage?: string;
//   createdAt: strig;
//   updatedAt: string;
// }

// export interface IInvoiceBaseFull extends IInvoiceBase {
//   items: IInvoiceItemBase[];
//   payments: IInvoicePaymentBase[];
// }

// export interface IInvoice extends IInvoiceBase {
//   expeditionDate: Dayjs;
//   expirationDate: Dayjs;
//   createdAt: Dayjs;
//   updatedAt: Dayjs;
//   search: string;
// }

// export interface IInvoicePayment extends IInvoicePaymentBase {
//   paymentDate: Dayjs;
//   createdAt: Dayjs;
//   updatedAt: Dayjs;
// }

// export interface IInvoiceFull extends IInvoice {
//   items: IInvoiceItemBase[];
//   payments: IInvoicePayment[];
// }

// export interface IInvoicePageData {
//   invoices: IInvoiceBase[];
//   customers: ICustomer[];
//   categories: IInvoiceCategory[];
//   products: IInvoiceProduct[];
//   cashboxs: IInvoiceCashbox[];
// }

// export interface IInvoicePageState {
//   invoices: IInvoice[];
//   customers: ICustomer[];
//   categories: IInvoiceCategory[];
//   products: IInvoiceProduct[];
//   cashboxs: IInvoiceCashbox[];
//   loading: boolean;
//   refreshIsSuccess: boolean;
//   // Show invoice
//   selectedInvoice: IInvoiceFull | null;
//   selectedInvoiceOpened: boolean;
//   selectedInvoiceLoading: boolean;
//   selectedInvoiceError: string | null;
//   // STORE INVOICE
//   formOpened: boolean;
//   counterSaleFormOpened: boolean;
//   storeLoading: boolean;
//   storeSuccess: boolean;
//   storeError: unknown;
//   // STORE PAYMENT
//   paymentFormOpened: boolean;
//   storePaymentLoading: boolean;
//   storePaymentSuccess?: string;
//   storePaymentError: unknown;
// }

export interface ISaleHistory {
  id: string;
  operationDate: string;
  operationType:
    | 'sale'
    | 'credit'
    | 'separate'
    | 'credit_payment'
    | 'separate_payment';
  description?: string;
  amount: number;
}
