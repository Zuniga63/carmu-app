import { Dayjs } from 'dayjs';
import { ErrorResponse } from '../CategoryPage/types';

export interface ICashier {
  id: string;
  name: string;
}

export interface IBox {
  id: string;
  cashier?: ICashier;
  users: string[];
  name: string;
  cashierName?: string;
  base: number;
  balance?: number;
  openBox?: string; // string Date
  closed?: string; // string Date
  transactions?: string[];
  closingRecords?: string[];
  createdAt: strig; // string Date
  updatedAt: string; // string Date
}

export interface ITransactionResponse {
  id: string;
  cashbox?: string;
  transactionDate: string;
  description: string;
  isTransfer: boolean;
  amount: number;
  balance: number;
  createdAt: strig; // string Date
  updatedAt: string; // string Date
}

export interface ITransaction extends ITransactionResponse {
  transactionDate: Dayjs;
  balance: number;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface IMainTransaction extends ITransaction {
  cashbox?: {
    id: string;
    name: string;
  };
}

export interface ITransactionRequest {
  date?: Dayjs;
  description: string;
  amount: number;
}

export interface IBoxWithDayjs extends IBox {
  openBox?: Dayjs;
  closed?: Dayjs;
  neverUsed: boolean;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  createIsSameUpdate: boolean;
  dateRefreshRate?: number;
}

export interface IMainBox {
  name: string;
  balance: number;
}

export interface IBoxesResponse {
  boxes: IBox[];
  mainBox: IMainBox | null;
}

export interface IOpenBoxRequest {
  boxId: string;
  base: number;
  cashierId?: string;
}

export interface ICloseBoxRequest {
  boxId: string;
  cash: number;
  observations?: string;
}

export interface IStoreTransactionRequest {
  boxId?: string;
  date?: Dayjs;
  description: string;
  amount: number;
}

export type BoxPageState = {
  boxes: IBox[];
  mainBox: IMainBox | null;
  showingMainBox: boolean;
  fetchLoading: boolean;
  fetchIsSuccess: boolean;
  fetchError: string | null;
  // Add box
  createFormOpened: boolean;
  storeBoxLoading: boolean;
  storeBoxIsSuccess: boolean;
  storeBoxError: ErrorResponse | null;
  // Open box
  boxToOpen?: IBox;
  openBoxLoading: boolean;
  openBoxIsSuccess: boolean;
  openBoxError: ErrorResponse | null;
  // Close Box
  boxToClose?: IBox;
  closeBoxLoading: boolean;
  closeBoxIsSuccess: boolean;
  closeBoxError: ErrorResponse | null;
  // Show Box
  boxSelected?: IBox;
  loadingTransactions: boolean;
  mountBoxIsSuccess: boolean;
  transactions: ITransactionResponse[];
  transactionsError: ErrorResponse | null;
  // Add Transaction
  storeTransactionFormOpened: boolean;
  storeTransactionLoading: boolean;
  storeTransactionIsSuccess: boolean;
  storeTransactionError: ErrorResponse | null;
};
