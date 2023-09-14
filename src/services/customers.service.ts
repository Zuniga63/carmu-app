import { ICustomer } from '@/types';
import axios from 'axios';

export const customerApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/customers` });

export async function getAllCustomers() {
  const res = await customerApi.get<ICustomer[]>('');
  return res.data;
}
