import { Dayjs } from 'dayjs';
import { type AxiosResponse } from 'axios';

export type ErrorResponse = Pick<AxiosResponse, 'data' | 'status'>;

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
  base: number;
  cashierId?: string;
}

export interface ICloseBoxRequest {
  boxId: string;
  cash: number;
  observations?: string;
}

export type CloseBoxRequest = {
  cashboxId: string;
  data: {
    cash: number;
    observations?: string;
  };
};

export interface IStoreTransactionRequest {
  boxId?: string;
  date?: Dayjs;
  description: string;
  amount: number;
}

export type StoreTransactionRequest = {
  date?: Dayjs;
  description: string;
  amount: number;
};
