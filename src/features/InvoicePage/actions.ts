import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ICancelInvoiceData } from 'src/components/InvoicePage/CancelInvoiceForm';
import { ICancelPaymentData } from 'src/components/InvoicePage/CancelInvoicePaymentForm';
import {
  IInvoiceBase,
  IInvoiceBaseFull,
  IInvoicePageData,
  IInvoicePaymentData,
  IInvoiceStoreData,
} from './types';

/**
 * This is the time for reset the all success property
 */
const RESET_TIMEOUT = 3000;

export const fetchInvoiceData = createAsyncThunk(
  'invoicePage/fetchInvoiceData',
  async (_, { dispatch }) => {
    const res = await axios.get<IInvoicePageData>('/invoices');
    setTimeout(() => {
      dispatch(resetSuccess());
    }, RESET_TIMEOUT);
    return res.data;
  }
);

export const resetSuccess = createAction('invoicePage/resetSuccess');

// ----------------------------------------------------------------------------
// NEW INVOICE
// ----------------------------------------------------------------------------
export const showNewInvoiceForm = createAction(
  'invoicePage/showNewInvoiceForm'
);

export const hideNewInvoiceForm = createAction(
  'invoicePage/hideNewInvoiceForm'
);

export const storeNewInvoice = createAsyncThunk(
  'invoicePage/storeNewInvoice',
  async (invoiceData: IInvoiceStoreData, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post<{ invoice: IInvoiceBase }>(
        '/invoices',
        invoiceData
      );

      setTimeout(() => {
        dispatch(resetSuccess());
      }, RESET_TIMEOUT);
      return res.data.invoice;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  }
);

export const showCounterSaleForm = createAction(
  'invoicePage/showCounterSaleForm'
);
export const hideCounterSaleForm = createAction(
  'invoicePage/hideCounterSaleForm'
);

// ----------------------------------------------------------------------------
// MOUNT INVOICE
// ----------------------------------------------------------------------------
export const mountInvoice = createAsyncThunk(
  'invoicePage/mountInvoice',
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get<{ invoice: IInvoiceBaseFull }>(
        `/invoices/${invoiceId}`
      );

      return res.data.invoice;
    } catch (error) {
      return rejectWithValue('No se pudo recuperar la factura.');
    }
  }
);
export const unmountInvoice = createAction('invoicePage/unmountInvoice');

// ----------------------------------------------------------------------------
// PAYD INVOICE
// ----------------------------------------------------------------------------
export const showPaymentForm = createAction('invoicePage/showPaymentForm');
export const hidePaymentForm = createAction('invoicePage/hidePaymentForm');
export const registerPayment = createAsyncThunk(
  'invoicePage/registerPayment',
  async (data: IInvoicePaymentData, { rejectWithValue, dispatch }) => {
    const url = `/invoices/${data.invoiceId}/add-payment`;
    try {
      const res = await axios.post<{
        invoice: IInvoiceBaseFull;
        message: string;
      }>(url, data);

      setTimeout(() => {
        dispatch(resetSuccess());
      }, RESET_TIMEOUT);

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

// ----------------------------------------------------------------------------
// CANCEL INVOICE PAYMENT
// ----------------------------------------------------------------------------
export const showCancelPaymentForm = createAction<string>(
  'invoicePage/showCancelPaymentForm'
);

export const hideCancelPaymentForm = createAction(
  'invoicePage/hideCancelPaymentForm'
);

export const cancelInvoicePayment = createAsyncThunk(
  'invoicePage/cancelInvoicePayment',
  async (formData: ICancelPaymentData, { rejectWithValue, dispatch }) => {
    const { invoiceId, paymentId, ...rest } = formData;
    const url = `/invoices/${invoiceId}/payments/${paymentId}/cancel-payment`;

    try {
      const res = await axios.put<IInvoiceBaseFull>(url, rest);
      dispatch(fetchInvoiceData());
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        if (status === 400 || status === 404) {
          return rejectWithValue((data as { message: string }).message);
        }
      }

      throw error;
    }
  }
);

// ----------------------------------------------------------------------------
// CANCEL INVOICE
// ----------------------------------------------------------------------------
export const showCancelInvoiceForm = createAction(
  'invoicePage/showCancelInvoiceForm'
);
export const hideCancelInvoiceForm = createAction(
  'invoicePage/hideCancelInvoiceForm'
);

export const cancelInvoice = createAsyncThunk(
  'invoicePage/cancelInvoice',
  async (data: ICancelInvoiceData, { rejectWithValue, dispatch }) => {
    try {
      const { invoiceId, ...rest } = data;
      const url = `/invoices/${invoiceId}/cancel`;

      const res = await axios.put<IInvoiceBaseFull>(url, rest);
      dispatch(fetchInvoiceData());
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        if (status === 400 || status === 404) {
          return rejectWithValue((data as { message: string }).message);
        }
      }

      throw error;
    }
  }
);
