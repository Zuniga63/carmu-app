import type { PremiseStoreCashbox } from './PremiseStoreCashbox.interface';

export interface PremiseStore {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  defaultBox?: PremiseStoreCashbox;
  invoices: number;
  monthlySales: number;
  weeklySales: number;
}
