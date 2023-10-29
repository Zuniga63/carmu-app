import type { IBoxesResponse } from '@/types';
import axios from 'axios';

export const boxesApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/boxes` });

export async function getAllBoxes() {
  const res = await boxesApi.get<IBoxesResponse>('');
  return res.data;
}
