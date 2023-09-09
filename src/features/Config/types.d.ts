import { ErrorResponse, IBox } from '@/types';

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

export type ConfigState = {
  premiseStores: IPremiseStore[];
  fetchPremiseStoresLoading: boolean;
  premiseStoreSelected?: IPremiseStore | undefined;
  // STORE AND UPDATE
  commercialPremiseToUpdate: IPremiseStore | null;
  premiseFormOpened: boolean;
  premiseFormLoading: boolean;
  premiseFormIsSuccess: boolean;
  premiseFormError: ErrorResponse | null;

  blockSensitiveInformation: boolean;
};
