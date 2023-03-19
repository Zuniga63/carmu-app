import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  ICommercialPremise,
  IStoreCommercialPremise,
  IUpdateCommercialPremise,
} from './types';

export const COMMERCIAL_PREMISE_KEY = 'commercialPremise';

export const fetchCommercialPremises = createAsyncThunk(
  'config/fetchCommercialPremises',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<ICommercialPremise[]>('/stores');
      let commercialPremise: ICommercialPremise | undefined;

      const storeId = localStorage.getItem(COMMERCIAL_PREMISE_KEY);
      if (storeId) {
        commercialPremise = res.data.find(item => item.id === storeId);
        if (!commercialPremise) {
          localStorage.removeItem(COMMERCIAL_PREMISE_KEY);
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

// ----------------------------------------------------------------------------
// STORE NEW COMMERCIAL PREMISE
// ----------------------------------------------------------------------------
export const showPremiseForm = createAction('config/showPremiseForm');
export const hidePremiseForm = createAction('config/hidePremiseForm');
export const storeCommercialPremise = createAsyncThunk(
  'config/storeCommercialPremise',
  async (data: IStoreCommercialPremise, { rejectWithValue }) => {
    try {
      const res = await axios.post<ICommercialPremise>('/stores', data);
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

export const editCommercialPremise = createAction<string>(
  'config/editCommercialPremise'
);
export const updateCommercialPremise = createAsyncThunk(
  'config/updateCommercialPremise',
  async (data: IUpdateCommercialPremise, { rejectWithValue }) => {
    try {
      const { storeId, ...body } = data;
      const url = `/stores/${storeId}`;
      const res = await axios.patch<ICommercialPremise>(url, body);
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
