import { IImage } from 'src/types';
import { Socket } from 'socket.io-client';
import { AxiosResponse } from 'axios';

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

export type ErrorResponse = Pick<AxiosResponse, 'data' | 'status'>;

export type CategoryPageState = {
  socket: undefined | Socket;
  categories: ICategory[];
  loading: boolean;
  error: ErrorResponse | null;
  categoryToUpdate: ICategory | undefined;
  formOpened: boolean;
  storeIsSuccess: boolean;
  updateIsSuccess: boolean;
  storeError: unknown;
  storeOrderLoading: boolean;
  storeOrderIsSuccess: boolean;
  storeOrderError: boolean;
  updateError: unknown;
  formIsLoading: boolean;
};

export interface INewOrderData {
  mainCategory?: ICategory;
  newList: ICategory[];
  originalList: ICategory[];
}
