import { createReducer } from '@reduxjs/toolkit';
import {
  destroyCategory,
  discreteFetch,
  fetchCategories,
  hideCategoryForm,
  setCategories,
  setStoreIsSuccess,
  setUpdateIsSuccess,
  showCategoryForm,
  storeCategory,
  storeCategoryOrder,
  updateCategory,
} from './actions';
import { CategoryPageState, ErrorResponse, ICategory } from './types';

const initialState: CategoryPageState = {
  socket: undefined,
  categories: [],
  loading: true,
  error: null,
  formOpened: false,
  categoryToUpdate: undefined,
  storeIsSuccess: false,
  updateIsSuccess: false,
  storeError: null,
  storeOrderLoading: false,
  storeOrderIsSuccess: false,
  storeOrderError: false,
  updateError: null,
  formIsLoading: false,
};

export const categoryPageReducer = createReducer(initialState, builder => {
  // -------------------------------------------------------------------------
  // FETCH CATEGORIES
  // -------------------------------------------------------------------------
  builder
    .addCase(fetchCategories.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCategories.fulfilled, (state, { payload }) => {
      state.categories = payload;
      state.loading = false;
    })
    .addCase(fetchCategories.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload ? (payload as ErrorResponse) : null;
    });

  builder.addCase(discreteFetch.fulfilled, (state, { payload }) => {
    state.categories = payload;
  });

  builder
    .addCase(setCategories, (state, { payload }) => {
      state.categories = payload;
    })
    .addCase(showCategoryForm, (state, { payload }) => {
      state.formOpened = true;
      if (payload) {
        state.categoryToUpdate = payload;
      }
    })
    .addCase(hideCategoryForm, state => {
      state.formOpened = false;
      state.formIsLoading = false;
      state.categoryToUpdate = undefined;
      state.storeError = null;
      state.updateError = null;
    });
  // -------------------------------------------------------------------------
  // STORE NEW CATEGORY
  // --------------------------------------------------------------------------
  builder
    .addCase(storeCategory.pending, state => {
      state.formIsLoading = true;
    })
    .addCase(storeCategory.fulfilled, (state, { payload }) => {
      state.categories.push(payload);
      state.storeIsSuccess = true;
      state.formIsLoading = false;
    })
    .addCase(storeCategory.rejected, (state, { payload }) => {
      state.formIsLoading = false;
      state.storeError = payload;
    })
    .addCase(setStoreIsSuccess, (state, { payload }) => {
      state.storeIsSuccess = payload;
    });
  // -------------------------------------------------------------------------
  // UPDATE CATEGORY
  // --------------------------------------------------------------------------
  builder
    .addCase(updateCategory.pending, state => {
      state.formIsLoading = true;
    })
    .addCase(updateCategory.fulfilled, (state, { payload }) => {
      const updatedList = state.categories.map(category => {
        if (category.id === payload.id) return { ...category, ...payload };
        return category;
      });

      state.categories = updatedList;
      state.updateIsSuccess = true;
      state.formIsLoading = false;
    })
    .addCase(updateCategory.rejected, (state, { payload }) => {
      state.formIsLoading = false;
      state.updateError = payload;
    })
    .addCase(setUpdateIsSuccess, (state, { payload }) => {
      state.updateIsSuccess = payload;
    });

  builder.addCase(destroyCategory.fulfilled, (state, { payload }) => {
    if (payload) {
      const index = state.categories.findIndex(item => item.id === payload.id);
      const list = state.categories.slice();

      if (index >= 0) {
        list.splice(index, 1);
        state.categories = list;
      }
    }
  });

  builder
    .addCase(storeCategoryOrder.pending, state => {
      state.storeOrderLoading = true;
      state.storeOrderError = false;
      state.storeOrderIsSuccess = false;
    })
    .addCase(storeCategoryOrder.fulfilled, state => {
      state.storeOrderIsSuccess = true;
      state.storeOrderLoading = false;
    })
    .addCase(storeCategoryOrder.rejected, (state, { payload }) => {
      state.storeOrderError = true;
      state.categories = payload as ICategory[];
      state.storeOrderLoading = false;
    });
});

export default categoryPageReducer;
