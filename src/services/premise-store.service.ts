import { IPremiseStore, IUpdatePremiseStore } from '@/types';
import { IStorePremiseStore } from '@/types';
import axios from 'axios';

export const premiseStoreApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/stores` });

export async function getAllPremiseStore() {
  const res = await premiseStoreApi.get<IPremiseStore[]>('');
  return res.data;
}

export async function storePremiseStore(data: IStorePremiseStore) {
  const res = await premiseStoreApi.post<IPremiseStore>('', data);
  return res.data;
}

export async function updatePremiseStore(data: IUpdatePremiseStore) {
  const { storeId, ...body } = data;
  const res = await premiseStoreApi.patch<IPremiseStore>(`/${storeId}`, body);
  return res.data;
}
