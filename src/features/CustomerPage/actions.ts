import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/store';
import Swal from 'sweetalert2';
import { ICustomerStore, ICustomerWithInvoices } from './types';
import { ICustomer } from './types';

export const fetchCustomers = createAsyncThunk('customerPage/fetchCustomers', async () => {
  const res = await axios.get<ICustomer[]>('/customers');
  return res.data;
});

export const showCustomerForm = createAction('customerPage/showCustomerForm');
export const hideCustomerForm = createAction('customerPage/hideCustomerForm');
export const storeCustomer = createAsyncThunk(
  'customerPage/storeCustomer',
  async (data: ICustomerStore, { rejectWithValue }) => {
    try {
      const res = await axios.post<ICustomer>('/customers', data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  },
);
export const mountCustomerToUpdate = createAction<string>('customerPage/mountCustomerToUpdate');
export const updateCustomer = createAsyncThunk(
  'customerPage/updateCustomer',
  async (data: ICustomerStore, { rejectWithValue }) => {
    const url = `/customers/${data.id}`;
    try {
      const res = await axios.put<ICustomer>(url, data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  'customerPage/deleteCustomer',
  async (customerId: string, { getState, dispatch }) => {
    const { customers } = (getState() as RootState).customerPage;
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const url = `customers/${customer.id}`;

      const message = /*html */ `
      El cliente "<strong>${customer.fullName}</strong>" 
      será eliminado permanentemente y esta acción no puede revertirse.`;

      const result = await Swal.fire({
        title: '<strong>¿Desea eliminar el cliente?</strong>',
        html: message,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, ¡Eliminalo!',
        backdrop: true,
        icon: 'warning',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const result = { ok: false, message: '' };
          try {
            const res = await axios.delete(url);
            if (res.data.ok) {
              result.ok = true;
              result.message = `¡El cliente ${customer.fullName} fue eliminado satisfactoriamente!`;
            } else {
              result.message = 'El cliente no pudo ser removido, intentelo nuevamente mas tarde';
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              const { response } = error;
              if (response?.status === 404) dispatch(fetchCustomers());
              result.message = (response?.data as { message: string }).message;
            } else {
              result.message = 'Hubo un error al procesar la solicitud, intentalo nuevamente mas tarde.';
              console.log(error);
            }
          }

          return result;
        },
      });

      if (result.isConfirmed && result.value) {
        const { ok, message } = result.value;
        const title = ok ? '<strong>¡Cliente Eliminado!</strong>' : '¡Ops, algo salio mal!';
        const icon = ok ? 'success' : 'error';

        Swal.fire({ title, html: message, icon });

        return customer;
      }
    }

    return null;
  },
);

export const mountCustomerToFetch = createAction<string>('customerPage/mountCustomerToFetch');

export const unmountCustomer = createAction('customerPage/unmountCustomer');

export const fetchCustomer = createAsyncThunk('customerPage/fetchCustomer', async (customerId: string) => {
  const res = await axios.get<ICustomerWithInvoices>(`/customers/${customerId}`);

  return res.data;
});

// --------------------------------------------------------------------------
// STORE PAYMENT
// --------------------------------------------------------------------------
export const mountCustomerToPayment = createAction<string>('customerPage/mountCustomerToPayment');

export const unmountCustomerToPayment = createAction('customerPage/unmountCustomerToPayment');

export const storeCustomerPayment = createAsyncThunk(
  'customerPage/storeCustomerPayment',
  async (data: unknown, { dispatch, rejectWithValue, getState }) => {
    try {
      const { customerToPayment } = (getState() as RootState).customerPage;
      const url = `/customers/${customerToPayment?.id}/add-credit-payment`;
      await axios.post(url, data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        return rejectWithValue({ data, status });
      }

      throw error;
    }
  },
);
