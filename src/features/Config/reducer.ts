import { createReducer } from '@reduxjs/toolkit';
import { ConfigState } from './types';
import { ErrorResponse } from '@/types';
import {
  PREMISE_STORE_KEY,
  editPremiseStore,
  fetchPremiseStores,
  hidePremiseForm,
  selectCommercialPremise,
  showPremiseForm,
  storePremiseStore,
  unselectPremiseStore,
  updatePremiseStore,
} from './actions';

const initialState: ConfigState = {
  premiseStores: [],
  fetchPremiseStoresLoading: false,
  premiseStoreSelected: undefined,
  // UPDATE AND STORE PREMISE
  commercialPremiseToUpdate: null,
  premiseFormOpened: false,
  premiseFormLoading: false,
  premiseFormIsSuccess: false,
  premiseFormError: null,
};

export const configStateReducer = createReducer(initialState, builder => {
  // --------------------------------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------------------------------
  builder
    .addCase(fetchPremiseStores.pending, state => {
      state.fetchPremiseStoresLoading = true;
    })
    .addCase(fetchPremiseStores.fulfilled, (state, { payload }) => {
      const { premises, commercialPremise } = payload;
      state.premiseStores = premises;
      state.premiseStoreSelected = commercialPremise;
      state.fetchPremiseStoresLoading = false;
    });

  builder
    .addCase(selectCommercialPremise, (state, { payload }) => {
      const premise = state.premiseStores.find(item => item.id === payload);
      if (premise) {
        state.premiseStoreSelected = premise;
        localStorage.setItem(PREMISE_STORE_KEY, premise.id);
      }
    })
    .addCase(unselectPremiseStore, state => {
      state.premiseStoreSelected = undefined;
      localStorage.removeItem(PREMISE_STORE_KEY);
    });

  // --------------------------------------------------------------------------
  // STORE NEW COMMERCIAL PREMISE
  // --------------------------------------------------------------------------
  builder
    .addCase(showPremiseForm, state => {
      state.premiseFormOpened = true;
    })
    .addCase(hidePremiseForm, state => {
      state.commercialPremiseToUpdate = null;
      state.premiseFormLoading = false;
      state.premiseFormIsSuccess = false;
      state.premiseFormError = null;
      state.premiseFormOpened = false;
    });

  builder
    .addCase(storePremiseStore.pending, state => {
      state.premiseFormLoading = true;
      state.premiseFormIsSuccess = false;
      state.premiseFormError = null;
    })
    .addCase(storePremiseStore.fulfilled, (state, { payload }) => {
      state.premiseFormLoading = false;
      state.premiseFormIsSuccess = true;
      state.premiseStores.push(payload);
    })
    .addCase(storePremiseStore.rejected, (state, { payload }) => {
      state.premiseFormLoading = false;
      state.premiseFormError = payload as ErrorResponse;
    });

  // --------------------------------------------------------------------------
  // UPDATE COMMERCIAL PREMISE
  // --------------------------------------------------------------------------
  builder.addCase(editPremiseStore, (state, { payload }) => {
    const commercial = state.premiseStores.find(item => item.id === payload);

    if (commercial) {
      state.commercialPremiseToUpdate = commercial;
      state.premiseFormOpened = true;
    }
  });

  builder
    .addCase(updatePremiseStore.pending, state => {
      state.premiseFormLoading = true;
      state.premiseFormIsSuccess = false;
      state.premiseFormError = null;
    })
    .addCase(updatePremiseStore.fulfilled, (state, { payload }) => {
      const { premiseStores: oldList } = state;
      const index = oldList.findIndex(item => item.id === payload.id);

      if (index >= 0) {
        const newList = oldList.slice();
        newList.splice(index, 1, payload);
        state.premiseStores = newList;
        // TODO: Code for update local storage and selected bussiness
      }

      state.premiseFormLoading = false;
      state.premiseFormIsSuccess = true;
    })
    .addCase(updatePremiseStore.rejected, (state, { payload }) => {
      state.premiseFormLoading = false;
      state.premiseFormError = payload as ErrorResponse;
    });
});

export default configStateReducer;
