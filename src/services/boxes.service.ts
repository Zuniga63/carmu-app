import type {
  CloseBoxRequest,
  IBox,
  IBoxesResponse,
  IOpenBoxRequest,
  ITransactionResponse,
  StoreTransactionRequest,
} from '@/types';
import axios from 'axios';

export const boxesApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/boxes` });
export const mainBoxApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/main-box` });

export async function getAllBoxes() {
  const res = await boxesApi.get<IBoxesResponse>('');
  return res.data;
}

export async function createBox(data: { name: string }) {
  const res = await boxesApi.post<{ cashbox: IBox }>('', data);
  return res.data;
}

export async function removeBox(boxId: string) {
  const res = await boxesApi.delete<{ cashbox: IBox }>(`/${boxId}`);
  return res.data;
}

export async function openBox({ data, boxId }: { data: IOpenBoxRequest; boxId: string }) {
  const res = await boxesApi.put<{ cashbox: IBox }>(`/${boxId}/open`, data);
  return res.data.cashbox;
}

export async function closeCashbox({ data, cashboxId }: CloseBoxRequest) {
  const res = await boxesApi.put<{ cashbox: IBox }>(`/${cashboxId}/close`, data);
  return res.data.cashbox;
}

export async function getMinorTransactions({ boxId }: { boxId: string }) {
  const res = await boxesApi.get<{ transactions: ITransactionResponse[] }>(`/${boxId}/transactions`);
  return res.data.transactions;
}

export async function getMainTransactions() {
  const res = await mainBoxApi.get<{ transactions: ITransactionResponse[] }>('/transactions');
  return res.data.transactions;
}

export async function storeMinorTransaction({ data, boxId }: { data: StoreTransactionRequest; boxId: string }) {
  const res = await boxesApi.post<{ transaction: ITransactionResponse }>(`/${boxId}/transactions`, data);
  return res.data.transaction;
}

export async function storeMainTransaction({ data }: { data: StoreTransactionRequest }) {
  const res = await mainBoxApi.post<{ transaction: ITransactionResponse }>(`/transactions`, data);
  return res.data.transaction;
}

export async function removeMinorTransaction({ transactionId, boxId }: { transactionId: string; boxId: string }) {
  const res = await boxesApi.delete<{ transaction: ITransactionResponse }>(`/${boxId}/transactions/${transactionId}`);
  return res.data.transaction;
}

export async function removeMainTransaction(transactionId: string) {
  const res = await mainBoxApi.delete<{ transaction: ITransactionResponse }>(`/transactions/${transactionId}`);
  return res.data.transaction;
}
