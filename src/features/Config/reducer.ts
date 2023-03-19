import { createReducer } from '@reduxjs/toolkit';
import { ConfigState } from './types';
import { ErrorResponse } from 'src/types';
import {
  COMMERCIAL_PREMISE_KEY,
  editCommercialPremise,
  fetchCommercialPremises,
  hidePremiseForm,
  selectCommercialPremise,
  showPremiseForm,
  storeCommercialPremise,
  updateCommercialPremise,
} from './actions';

const initialState: ConfigState = {
  commercialPremises: [],
  fetchCommercialPremisesLoading: false,
  commercialPremiseSelected: undefined,
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
    .addCase(fetchCommercialPremises.pending, state => {
      state.fetchCommercialPremisesLoading = true;
    })
    .addCase(fetchCommercialPremises.fulfilled, (state, { payload }) => {
      const { premises, commercialPremise } = payload;
      state.commercialPremises = premises;
      state.commercialPremiseSelected = commercialPremise;
      state.fetchCommercialPremisesLoading = false;
    });

  builder.addCase(selectCommercialPremise, (state, { payload }) => {
    const premise = state.commercialPremises.find(item => item.id === payload);
    if (premise) {
      state.commercialPremiseSelected = premise;
      localStorage.setItem(COMMERCIAL_PREMISE_KEY, premise.id);
    }
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
    .addCase(storeCommercialPremise.pending, state => {
      state.premiseFormLoading = true;
      state.premiseFormIsSuccess = false;
      state.premiseFormError = null;
    })
    .addCase(storeCommercialPremise.fulfilled, (state, { payload }) => {
      state.premiseFormLoading = false;
      state.premiseFormIsSuccess = true;
      state.commercialPremises.push(payload);
    })
    .addCase(storeCommercialPremise.rejected, (state, { payload }) => {
      state.premiseFormLoading = false;
      state.premiseFormError = payload as ErrorResponse;
    });

  // --------------------------------------------------------------------------
  // UPDATE COMMERCIAL PREMISE
  // --------------------------------------------------------------------------
  builder.addCase(editCommercialPremise, (state, { payload }) => {
    const commercial = state.commercialPremises.find(
      item => item.id === payload
    );

    if (commercial) {
      state.commercialPremiseToUpdate = commercial;
      state.premiseFormOpened = true;
    }
  });

  builder
    .addCase(updateCommercialPremise.pending, state => {
      state.premiseFormLoading = true;
      state.premiseFormIsSuccess = false;
      state.premiseFormError = null;
    })
    .addCase(updateCommercialPremise.fulfilled, (state, { payload }) => {
      const { commercialPremises: oldList } = state;
      const index = oldList.findIndex(item => item.id === payload.id);

      if (index >= 0) {
        const newList = oldList.slice();
        newList.splice(index, 1, payload);
        state.commercialPremises = newList;
        // TODO: Code for update local storage and selected bussiness
      }

      state.premiseFormLoading = false;
      state.premiseFormIsSuccess = true;
    })
    .addCase(updateCommercialPremise.rejected, (state, { payload }) => {
      state.premiseFormLoading = false;
      state.premiseFormError = payload as ErrorResponse;
    });
});

export default configStateReducer;
