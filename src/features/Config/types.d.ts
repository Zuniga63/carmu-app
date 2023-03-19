import { ErrorResponse, IBox } from 'src/types';

export interface ICommercialPremise {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  defaultBox?: IBox;
  invoices: string[];
}

export interface IStoreCommercialPremise {
  name: string;
  address?: string;
  phone?: string;
  defaultBox?: string;
}

export interface IUpdateCommercialPremise extends IStoreCommercialPremise {
  storeId: string;
}

export type ConfigState = {
  commercialPremises: ICommercialPremise[];
  fetchCommercialPremisesLoading: boolean;
  commercialPremiseSelected?: ICommercialPremise | undefined;
  // STORE AND UPDATE
  commercialPremiseToUpdate: ICommercialPremise | null;
  premiseFormOpened: boolean;
  premiseFormLoading: boolean;
  premiseFormIsSuccess: boolean;
  premiseFormError: ErrorResponse | null;
};
