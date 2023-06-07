import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  IPremiseStore,
  IStorePremiseStore,
  IUpdatePremiseStore,
} from './types';

export const PREMISE_STORE_KEY = 'premiseStoreId';

export const fetchPremiseStores = createAsyncThunk(
  'config/fetchPremiseStores',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<IPremiseStore[]>('/stores');
      let commercialPremise: IPremiseStore | undefined;

      const storeId = localStorage.getItem(PREMISE_STORE_KEY);
      if (storeId) {
        commercialPremise = res.data.find(item => item.id === storeId);
        if (!commercialPremise) {
          localStorage.removeItem(PREMISE_STORE_KEY);
        }
      }
      return { premises: res.data, commercialPremise };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  }
);

export const selectCommercialPremise = createAction<string>(
  'config/selectCommercialPremise'
);

export const unselectPremiseStore = createAction('config/unselectPremiseStore');

// ----------------------------------------------------------------------------
// STORE NEW COMMERCIAL PREMISE
// ----------------------------------------------------------------------------
export const showPremiseForm = createAction('config/showPremiseForm');
export const hidePremiseForm = createAction('config/hidePremiseForm');
export const storePremiseStore = createAsyncThunk(
  'config/storePremiseStore',
  async (data: IStorePremiseStore, { rejectWithValue }) => {
    try {
      const res = await axios.post<IPremiseStore>('/stores', data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  }
);

export const editPremiseStore = createAction<string>('config/editPremiseStore');
export const updatePremiseStore = createAsyncThunk(
  'config/updatePremiseStore',
  async (data: IUpdatePremiseStore, { rejectWithValue }) => {
    try {
      const { storeId, ...body } = data;
      const url = `/stores/${storeId}`;
      const res = await axios.patch<IPremiseStore>(url, body);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  }
);

export const unlockContent = createAction<string>('config/unlockContent');
