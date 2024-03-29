import { AxiosResponse } from 'axios';
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

export type ErrorResponse = Pick<AxiosResponse, 'data' | 'status'>;

export * from './auth';
export * from './categories';
export * from './cashboxes';
export * from './invoices';
export * from './cash-report';

export interface IPremiseStore {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  defaultBox?: IBox;
  invoices: string[];
  monthlySales: number;
  weeklySales: number;
}

export interface IStorePremiseStore {
  name: string;
  address?: string;
  phone?: string;
  defaultBox?: string;
}

export interface IUpdatePremiseStore extends IStorePremiseStore {
  storeId: string;
}

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
export * from './customer';

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
  productSize?: string;
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

export interface ISaleHistory {
  id: string;
  operationDate: string;
  operationType: 'sale' | 'credit' | 'separate' | 'credit_payment' | 'separate_payment';
  description?: string;
  amount: number;
}
