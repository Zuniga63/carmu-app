import type { ApiPremiseStoreCashbox } from './api-premise-store-cashbox.interface';

export interface ApiPremiseStore {
  id: string;
  name: string;
  defaultBox: ApiPremiseStoreCashbox;
  invoices: string[];
  address?: string;
  phone?: string;
  monthlySales: number;
  weeklySales: number;
  _id: string;
  __v: number;
}
