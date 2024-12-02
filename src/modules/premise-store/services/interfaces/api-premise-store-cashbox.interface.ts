export interface ApiPremiseStoreCashbox {
  _id: string;
  users: string[];
  name: string;
  base: number;
  transactions: string[];
  closingRecords: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  cashierName: string;
  cashier: string;
  openBox?: string;
  id: string;
}
