import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { io, Socket } from 'socket.io-client';
import { AppThunkAction, Category } from 'types';
import { actionBody } from 'utils';
import {
  ADD_MAIN_CATEGORY,
  CONNECT_TO_WEB_SOCKET,
  DISCONNECT_TO_WEB_SOCKET,
  FORM_IS_LOADING,
  HIDE_FORM,
  MOUNT_CATEGORY_TO_UPDATE,
  REMOVE_MAIN_CATEGORY,
  SET_CATEGORIES,
  SHOW_FORM,
  STORE_CATEGORY_ERROR,
  STORE_IS_SUCCESS,
  STORE_NEW_ORDER_IS_SUCCESS,
  UPDATE_CATEGORY_ERROR,
  UPDATE_IS_SUCCESS,
  UPDATE_MAIN_CATEGORY,
} from './actions';

const headers = { 'Content-Type': 'multipart/form-data' };
const clientRoom = 'categoryPage';
const event = {
  newCategory: 'newCategory',
  updateCategory: 'updateCategory',
  deleteCategory: 'deleteCategory',
  reorderCategory: 'reorderCategory',
};
let socket: Socket;

const emitSocketEvent = (name: string, payload: unknown) => {
  const eventName = `${clientRoom}:${name}`;
  if (socket) socket.emit(eventName, payload);
};

export const setCategories = (categories: Category[]): AppThunkAction => {
  return dispatch => {
    dispatch(actionBody(SET_CATEGORIES, categories));
  };
};

export const fetchCategories = (): AppThunkAction => {
  return async dispatch => {
    try {
      const res = await axios.get('/categories');
      dispatch(actionBody(SET_CATEGORIES, res.data.categories));
    } catch (error) {
      console.log(error);
    }
  };
};

export const storeCategoriesOrder = (
  newList: Category[],
  original: Category[],
  mainCategory?: Category
): AppThunkAction => {
  return async dispatch => {
    try {
      dispatch(actionBody(SET_CATEGORIES, newList));

      const requestData = { mainCategory, categoryIds: newList.map(item => item.id) };
      await axios.post('/categories/update-order', requestData);
      dispatch(actionBody(STORE_NEW_ORDER_IS_SUCCESS, true));
    } catch (error) {
      dispatch(actionBody(SET_CATEGORIES, original));
      console.log(error);
    }
    setTimeout(() => {
      dispatch(actionBody(STORE_NEW_ORDER_IS_SUCCESS, false));
    }, 2000);
  };
};

export const showCategoryForm =
  (category?: Category): AppThunkAction =>
  dispatch => {
    if (category) dispatch(actionBody(MOUNT_CATEGORY_TO_UPDATE, category));
    dispatch(actionBody(SHOW_FORM));
  };

export const hideCategoryForm = (): AppThunkAction => dispatch => {
  dispatch(actionBody(HIDE_FORM));
};

export const storeNewCategory = (formData: FormData): AppThunkAction => {
  return async dispatch => {
    const url = '/categories';
    dispatch(actionBody(FORM_IS_LOADING, true));
    dispatch(actionBody(STORE_CATEGORY_ERROR, null));
    dispatch(actionBody(STORE_IS_SUCCESS, false));

    try {
      const res = await axios.post(url, formData, { headers });
      const { category } = res.data;
      dispatch(actionBody(ADD_MAIN_CATEGORY, category));
      dispatch(actionBody(STORE_IS_SUCCESS, true));
      emitSocketEvent(event.newCategory, category);

      setTimeout(() => {
        dispatch(actionBody(STORE_IS_SUCCESS, false));
      }, 2000);
    } catch (error) {
      dispatch(actionBody(STORE_CATEGORY_ERROR, error));
    } finally {
      dispatch(actionBody(FORM_IS_LOADING, false));
    }
  };
};

export const updateCategory = (categoryToUpdate: Category, formData: FormData): AppThunkAction => {
  return async dispatch => {
    const url = `/categories/${categoryToUpdate.id}`;
    dispatch(actionBody(FORM_IS_LOADING, true));
    dispatch(actionBody(UPDATE_CATEGORY_ERROR, null));
    dispatch(actionBody(UPDATE_IS_SUCCESS, false));
    formData.append('order', String(categoryToUpdate.order));

    try {
      const res = await axios.put(url, formData, { headers });
      const { category } = res.data;
      dispatch(actionBody(UPDATE_MAIN_CATEGORY, category));
      dispatch(actionBody(UPDATE_IS_SUCCESS, true));
      emitSocketEvent(event.updateCategory, category);

      setTimeout(() => {
        dispatch(actionBody(UPDATE_IS_SUCCESS, false));
      }, 2000);
    } catch (error) {
      dispatch(actionBody(UPDATE_CATEGORY_ERROR, error));
    } finally {
      dispatch(actionBody(FORM_IS_LOADING, false));
    }
  };
};

export const destroyCategory = (categoryToDelete: Category): AppThunkAction => {
  return async dispatch => {
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
        const result: { ok: boolean; message: string | undefined; categoryDeleted: unknown } = {
          ok: false,
          message: undefined,
          categoryDeleted: undefined,
        };

        try {
          const res = await axios.delete(url);
          const { category } = res.data;

          dispatch(actionBody(REMOVE_MAIN_CATEGORY, category));
          emitSocketEvent(event.deleteCategory, category);
          result.ok = true;
          result.categoryDeleted = category;
        } catch (error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.status === 404) dispatch(fetchCategories());
            result.message = response?.data.message;
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
            (categoryDeleted as Category).name
          }</strong> fue eliminada con éxito.`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: '¡Ops, algo salio mal!',
          text: message,
          icon: 'error',
        });
      }
    }
  };
};

export const connectToSocket = (): AppThunkAction => {
  return dispath => {
    if (process.env.NEXT_PUBLIC_URL_API) {
      socket = io(process.env.NEXT_PUBLIC_URL_API);
      socket.emit('joinToCategoryRoom');

      // New category
      socket.on(`server:${event.newCategory}`, (newCategory: Category) => {
        dispath(actionBody(ADD_MAIN_CATEGORY, newCategory));
      });

      // Update
      socket.on(`server:${event.updateCategory}`, (categoryToUpdate: Category) => {
        dispath(actionBody(UPDATE_MAIN_CATEGORY, categoryToUpdate));
      });

      // Delete
      socket.on(`server:${event.deleteCategory}`, (categoryToDelete: Category) => {
        dispath(actionBody(REMOVE_MAIN_CATEGORY, categoryToDelete));
      });

      // Close websocket
      dispath(actionBody(CONNECT_TO_WEB_SOCKET, socket));
    }
  };
};

export const disconnectWebSocket = (): AppThunkAction => dispatch => dispatch(actionBody(DISCONNECT_TO_WEB_SOCKET));
