import type { IInvoiceProduct, IProductWithCategories } from '@/types';
import axios from 'axios';

export const productApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/products` });
const headers = { 'Content-Type': 'multipart/form-data' };

export async function getAllProducts() {
  const res = await productApi.get<IProductWithCategories[]>('');
  return res.data;
}

export async function getAllLiteProducts() {
  const res = await productApi.get<IInvoiceProduct[]>('', {
    params: { forList: true },
  });
  return res.data;
}

export async function createProduct(formData: FormData) {
  const res = await productApi.post<{ product: IProductWithCategories }>('', formData, { headers });
  return res.data.product;
}

export async function updateProduct({ id, formData }: { id: string; formData: FormData }) {
  const res = await productApi.put<{ product: IProductWithCategories }>(`/${id}`, formData, { headers });
  return res.data.product;
}

export async function removePropduct(id: string) {
  const res = await productApi.delete(`/${id}`);
  return res.data;
}
