import type { ICustomer, ICustomerStore, IInvoicePaymentData, ICustomerWithInvoices } from '@/types';
import axios from 'axios';

export const customerApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/customers` });

export async function getAllCustomers() {
  const res = await customerApi.get<ICustomer[]>('');
  return res.data;
}

export async function createNewCustomer(data: ICustomerStore) {
  const res = await customerApi.post<ICustomer>('', data);
  return res.data;
}

export async function updateCustomer({ customerId, data }: { customerId: string; data: ICustomerStore }) {
  const res = await customerApi.put<ICustomer>(`/${customerId}`, data);
  return res.data;
}

export async function deleteCustomer(customerId: string) {
  const res = await customerApi.delete<{ ok: boolean }>(`/${customerId}`);
  return res.data;
}

export async function createCustomerPayment({ data, customerId }: { data: IInvoicePaymentData; customerId: string }) {
  const res = await customerApi.post(`/${customerId}/add-credit-payment`, data);
  return res.data;
}

export async function getCustomerById(customerId: string) {
  const res = await customerApi.get<ICustomerWithInvoices>(`/${customerId}`);
  return res.data;
}
