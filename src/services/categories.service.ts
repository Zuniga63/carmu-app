import type { ICategory, IUpdateOrderReq } from '@/types';
import axios from 'axios';

export const categoryApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/categories` });
const headers = { 'Content-Type': 'multipart/form-data' };

export async function getAllCategories() {
  const res = await categoryApi.get<{ categories: ICategory[] }>('');
  return res.data.categories;
}

export async function storeNewCategory(data: FormData) {
  const res = await categoryApi.post<{ category: ICategory }>('', data, { headers });
  return res.data.category;
}

export async function updateCategory({ id, data }: { id: string; data: FormData }) {
  const res = await categoryApi.put<{ category: ICategory }>(`/${id}`, data, { headers });
  return res.data.category;
}

export async function deleteCategory({ id }: { id: string }) {
  const res = await categoryApi.delete<{ category: ICategory }>(`/${id}`);
  return res.data.category;
}

export async function updateCategoryOrder(data: IUpdateOrderReq) {
  const res = await categoryApi.post('/update-order', data);
  console.log(res.data);
  return true;
}
