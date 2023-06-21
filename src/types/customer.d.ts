//Use this type in the Custome table
export type CustomerFilters = {
  search: string;
  onlyCustomerWithDebt?: boolean;
  sortByBalance?: boolean;
  reverse?: boolean;
  sortByRecentPayment?: boolean;
};

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
