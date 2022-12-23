import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import Swal from 'sweetalert2';
import { ICategory, INewOrderData } from './types';

const headers = { 'Content-Type': 'multipart/form-data' };

let socket: Socket | undefined;
const clientRoom = 'categoryPage';

const event = {
  newCategory: 'newCategory',
  updateCategory: 'updateCategory',
  deleteCategory: 'deleteCategory',
  reorderCategory: 'reorderCategory',
};

const emitSocketEvent = (name: string, payload: unknown) => {
  const eventName = `${clientRoom}:${name}`;
  if (socket) socket.emit(eventName, payload);
};

export const connectToSocket = createAsyncThunk(
  'categoryPage/connectToSocket',
  (_, { dispatch }) => {
    if (process.env.NEXT_PUBLIC_URL_API) {
      socket = io(process.env.NEXT_PUBLIC_URL_API);
      socket.emit('joinToCategoryRoom');

      socket.on(`server:${event.newCategory}`, (_newCategory: ICategory) => {
        dispatch(discreteFetch());
      });

      // Update
      socket.on(
        `server:${event.updateCategory}`,
        (_categoryToUpdate: ICategory) => {
          dispatch(discreteFetch());
        }
      );
      // Delete
      socket.on(
        `server:${event.deleteCategory}`,
        (_categoryToDelete: ICategory) => {
          dispatch(discreteFetch());
        }
      );
    }
  }
);

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const fetchCategories = createAsyncThunk(
  'categoryPage/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<{ categories: ICategory[] }>('/categories');
      return res.data.categories;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  }
);

export const discreteFetch = createAsyncThunk(
  'categoryPage/discreteFetch',
  async () => {
    const res = await axios.get<{ categories: ICategory[] }>('/categories');
    return res.data.categories;
  }
);

export const setCategories = createAction<ICategory[]>(
  'categoryPage/setCategories'
);

export const showCategoryForm = createAction<ICategory | undefined>(
  'categoryPage/showCategoryForm'
);
export const hideCategoryForm = createAction('categoryPage/hideCategoryForm');

export const storeCategory = createAsyncThunk(
  'categoryPage/storeCategory',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post<{ category: ICategory }>(
        '/categories',
        data,
        {
          headers,
        }
      );
      const { category } = res.data;
      emitSocketEvent(event.newCategory, category);
      return category;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  }
);

export const setStoreIsSuccess = createAction<boolean>(
  'categoryPage/setStoreIsSuccess'
);

export const updateCategory = createAsyncThunk(
  'categoryPage/updateCategory',
  async (
    { category, data }: { category: ICategory; data: FormData },
    { rejectWithValue }
  ) => {
    const url = `/categories/${category.id}`;
    data.append('order', String(category.order));

    try {
      const res = await axios.put<{ category: ICategory }>(url, data, {
        headers,
      });
      emitSocketEvent(event.updateCategory, res.data.category);
      return res.data.category;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  }
);

export const setUpdateIsSuccess = createAction<boolean>(
  'categoryPage/setUpdateIsSuccess'
);

export const destroyCategory = createAsyncThunk(
  'categoryPage/destroyCategory',
  async (categoryToDelete: ICategory) => {
    const url = `/categories/${categoryToDelete.id}`;

    const message = /*html */ `La categoría "<strong>${categoryToDelete.name}</strong>" será eliminada permanentemente y no puede revertirse.`;

    const result = await Swal.fire({
      title: '<strong>¿Desea elimiar esta categoría?</strong>',
      html: message,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminala.',
      backdrop: true,
      icon: 'warning',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const result: {
          ok: boolean;
          message: string | undefined;
          categoryDeleted: ICategory | null;
        } = {
          ok: false,
          message: undefined,
          categoryDeleted: null,
        };

        try {
          const res = await axios.delete<{ category: ICategory }>(url);
          const { category } = res.data;
          result.ok = true;
          result.categoryDeleted = category;
          emitSocketEvent(event.deleteCategory, category);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const { data, status } = error.response;
            if (status === 404) {
              result.categoryDeleted = categoryToDelete;
            }
            result.message = (data as { message: string }).message;
          } else {
            console.log(error);
          }
        }
        return result;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed && result.value) {
      const { ok, categoryDeleted, message } = result.value;
      if (ok) {
        Swal.fire({
          title: '<strong>¡Categoría Eliminada!</strong>',
          html: /* html */ `La categoría <strong>${
            (categoryDeleted as ICategory).name
          }</strong> fue eliminada con éxito.`,
          icon: 'success',
        });
        return categoryDeleted;
      } else {
        Swal.fire({
          title: '¡Ops, algo salio mal!',
          text: message,
          icon: 'error',
        });
      }
    }
  }
);

export const storeCategoryOrder = createAsyncThunk(
  'categoryPage/storeCategoryOrder',
  async (data: INewOrderData, { dispatch, rejectWithValue }) => {
    dispatch(setCategories(data.newList));
    try {
      const requestData = {
        mainCategory: data.mainCategory,
        categoryIds: data.newList.map(item => item.id),
      };

      await axios.post('/categories/update-order', requestData);
    } catch (error) {
      return rejectWithValue(data.originalList);
    }
  }
);
