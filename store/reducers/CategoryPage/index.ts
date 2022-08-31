import { Category, IAction, ICategoryPageState } from 'types';
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

const initialState: ICategoryPageState = {
  categories: [],
  formOpened: false,
  categoryToUpdate: undefined,
  categoryToDelete: undefined,
  categoryDeleted: undefined,
  storeIsSuccess: false,
  storeNewOrderIsSuccess: false,
  updateIsSuccess: false,
  deleteIsFinished: false,
  storeError: null,
  storeNewOrderError: null,
  updateError: null,
  deleteError: null,
  formIsLoading: false,
};

export default function CategoryPageReducer(state = initialState, action: IAction): ICategoryPageState {
  switch (action.type) {
    case SET_CATEGORIES: {
      return {
        ...state,
        categories: action.payload as Category[],
      };
    }
    case STORE_NEW_ORDER_IS_SUCCESS: {
      return {
        ...state,
        storeNewOrderIsSuccess: action.payload as boolean,
      };
    }
    case SHOW_FORM: {
      return {
        ...state,
        formOpened: true,
      };
    }
    case FORM_IS_LOADING: {
      return {
        ...state,
        formIsLoading: action.payload as boolean,
      };
    }
    case HIDE_FORM: {
      return {
        ...state,
        formOpened: false,
        formIsLoading: false,
        categoryToUpdate: undefined,
        storeError: null,
        updateError: null,
      };
    }
    case MOUNT_CATEGORY_TO_UPDATE: {
      return {
        ...state,
        categoryToUpdate: action.payload as Category,
      };
    }
    case ADD_MAIN_CATEGORY: {
      const newCategory = action.payload as Category;
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }
    case UPDATE_MAIN_CATEGORY: {
      const categoryUpdate = action.payload as Category;
      const updatedList = state.categories.map(category => {
        if (category.id === categoryUpdate.id) return { ...category, ...categoryUpdate };
        return category;
      });

      return {
        ...state,
        categories: updatedList,
      };
    }
    case STORE_IS_SUCCESS: {
      return {
        ...state,
        storeIsSuccess: action.payload as boolean,
      };
    }
    case UPDATE_IS_SUCCESS: {
      return {
        ...state,
        updateIsSuccess: action.payload as boolean,
      };
    }
    case STORE_CATEGORY_ERROR: {
      return {
        ...state,
        storeError: action.payload,
      };
    }
    case UPDATE_CATEGORY_ERROR: {
      return {
        ...state,
        updateError: action.payload,
      };
    }
    case CONFIRM_CATEGORY_TO_DELETE: {
      return {
        ...state,
        categoryDeleted: undefined,
        categoryToDelete: action.payload as Category,
      };
    }
    case CANCEL_CETAGORY_DELETE: {
      return {
        ...state,
        categoryDeleted: undefined,
        categoryToDelete: undefined,
      };
    }
    case REMOVE_MAIN_CATEGORY: {
      const categoryDeleted = action.payload as Category;
      const newList = state.categories
        .filter(item => item.id !== categoryDeleted.id)
        .map(item => {
          const order = item.order > categoryDeleted.order ? item.order - 1 : item.order;
          return { ...item, order };
        });

      return {
        ...state,
        categoryDeleted,
        categories: newList,
      };
    }
    case DELETE_IS_FINISHED: {
      return {
        ...state,
        deleteIsFinished: action.payload as boolean,
        categoryToDelete: undefined,
      };
    }
    case DELETE_CATEGORY_ERROR: {
      return {
        ...state,
        deleteError: action.payload,
      };
    }
    default:
      return state;
  }
}
