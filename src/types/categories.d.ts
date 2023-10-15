import { IImage } from '@/types';

export interface ICategory {
  id: string;
  mainCategory?: string;
  name: string;
  slug: string;
  description?: string;
  image?: IImage;
  level: number;
  order: number;
  isEnabled: boolean;
  products: string[];
  subcategories: string[];
  urlSlug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryDeleteResponse {
  category: Category;
}

export interface IUpdateOrderReq {
  mainCategory?: string;
  categoryIds: string[];
}
