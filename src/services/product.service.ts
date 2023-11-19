import { CATEGORY_BASE_URL, PRODUCT_BASE_URL } from '@/config/constants';
import type { IInvoiceProduct, IProductPageInitialData, IProductWithCategories } from '@/types';
import axios from 'axios';

export const productApi = axios.create({ baseURL: PRODUCT_BASE_URL });

export async function getProductPageInititalData(token?: string) {
  const headers = { Authorization: `Bearer ${token}` };

  const result: IProductPageInitialData = {
    products: [],
    categories: [],
  };

  if (!token) return result;

  try {
    const [produtRes, categoryRes] = await Promise.all([
      fetch(PRODUCT_BASE_URL, { headers, cache: 'no-cache' }),
      fetch(CATEGORY_BASE_URL, { headers, cache: 'no-cache' }),
    ]);

    const productResData = await produtRes.json();
    const categoryResData = await categoryRes.json();

    result.products = productResData;
    result.categories = categoryResData.categories;
  } catch (error) {
    console.log(error);
  }

  return result;
}

export async function getAllProducts() {
  const res = await axios.get<IProductWithCategories[]>(PRODUCT_BASE_URL);
  return res.data;
}

export async function getAllLiteProducts() {
  const res = await axios.get<IInvoiceProduct[]>(PRODUCT_BASE_URL, {
    params: { forList: true },
  });
  return res.data;
}

export async function removePropduct(id: string) {
  const res = await axios.delete(`${PRODUCT_BASE_URL}/${id}`);
  return res.data;
}
