import axios from 'axios';
import { AppThunkAction, Category } from 'types';
import { actionBody } from 'utils';
import {
  ADD_MAIN_CATEGORY,
  CANCEL_CETAGORY_DELETE,
  CONFIRM_CATEGORY_TO_DELETE,
  DELETE_CATEGORY_ERROR,
  DELETE_IS_FINISHED,
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

export const storeCategoriesOrder = (newList: Category[], mainCategory?: Category): AppThunkAction => {
  return async dispatch => {
    // ! Code for managmen subcategories
    dispatch(actionBody(SET_CATEGORIES, newList));
    dispatch(actionBody(STORE_NEW_ORDER_IS_SUCCESS, true));
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
      dispatch(actionBody(ADD_MAIN_CATEGORY, res.data.category));
      dispatch(actionBody(STORE_IS_SUCCESS, true));

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
      dispatch(actionBody(UPDATE_MAIN_CATEGORY, res.data.category));
      dispatch(actionBody(UPDATE_IS_SUCCESS, true));

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

export const confirmCategoryToDelete = (categoryToDelete: Category): AppThunkAction => {
  return dispatch => {
    dispatch(actionBody(CONFIRM_CATEGORY_TO_DELETE, categoryToDelete));
  };
};

export const cancelCategoryToDelete = (): AppThunkAction => dispatch => dispatch(actionBody(CANCEL_CETAGORY_DELETE));

export const destroyCategory = (categoryId: string): AppThunkAction => {
  return async dispatch => {
    const url = `/categories/${categoryId}`;
    dispatch(actionBody(DELETE_IS_FINISHED, false));
    dispatch(actionBody(DELETE_CATEGORY_ERROR, null));
    try {
      const res = await axios.delete(url);
      dispatch(actionBody(REMOVE_MAIN_CATEGORY, res.data.category));
    } catch (error) {
      dispatch(actionBody(DELETE_CATEGORY_ERROR, error));
    } finally {
      dispatch(actionBody(DELETE_IS_FINISHED, true));
      setTimeout(() => dispatch(actionBody(DELETE_IS_FINISHED, false)), 2000);
    }
  };
};
