import { createReducer } from '@reduxjs/toolkit';
import { ErrorResponse } from '@/types';
import {
  deleteCustomer,
  fetchCustomer,
  fetchCustomers,
  hideCustomerForm,
  mountCustomerToFetch,
  mountCustomerToPayment,
  mountCustomerToUpdate,
  showCustomerForm,
  storeCustomer,
  storeCustomerPayment,
  unmountCustomer,
  unmountCustomerToPayment,
  updateCustomer,
} from './actions';
import { CustomerPageState } from './types';

const initialState: CustomerPageState = {
  customers: [],
  fetchLoading: false,
  fetchIsSuccess: false,
  fetchError: false,
  firstFetchLoading: true,
  // --------------------------------------------------------------------------
  // STORE CUSTOMER
  // --------------------------------------------------------------------------
  customerToUpdate: undefined,
  customerFormOpened: false,
  customerFormIsLoading: false,
  customerFormIsSuccess: false,
  customerFormError: null,
  // --------------------------------------------------------------------------
  // STORE PAYMENT
  // --------------------------------------------------------------------------
  customerToPayment: undefined,
  paymentFormOpened: false,
  paymentFormLoading: false,
  paymentFormIsSuccess: false,
  paymnerFormError: null,
};

export const customerPageReducer = createReducer(initialState, builder => {
  // --------------------------------------------------------------------------
  // FETCH CUSTOMERS
  // --------------------------------------------------------------------------
  builder
    .addCase(fetchCustomers.pending, state => {
      state.fetchLoading = true;
      state.fetchError = false;
      state.fetchIsSuccess = false;
    })
    .addCase(fetchCustomers.fulfilled, (state, { payload }) => {
      state.customers = payload;
      state.fetchLoading = false;
      state.fetchIsSuccess = true;
      state.firstFetchLoading = false;
    })
    .addCase(fetchCustomers.rejected, state => {
      state.fetchLoading = false;
      state.fetchError = true;
    });
  // --------------------------------------------------------------------------
  // STORE && UPDATE CUSTOMERS
  // --------------------------------------------------------------------------
  builder
    .addCase(showCustomerForm, state => {
      state.customerFormOpened = true;
    })
    .addCase(hideCustomerForm, state => {
      state.customerFormOpened = false;
      state.customerToUpdate = undefined;
    });

  // STORE
  builder
    .addCase(storeCustomer.pending, state => {
      state.customerFormIsLoading = true;
      state.customerFormIsSuccess = false;
      state.customerFormError = null;
    })
    .addCase(storeCustomer.fulfilled, (state, { payload }) => {
      const newList = state.customers.slice();
      newList.push(payload);
      newList.sort((c1, c2) => c1.fullName.localeCompare(c2.fullName));

      state.customers = newList;
      state.customerFormIsLoading = false;
      state.customerFormIsSuccess = true;
    })
    .addCase(storeCustomer.rejected, (state, { payload }) => {
      state.customerFormError = payload as ErrorResponse;
      state.customerFormIsLoading = false;
    });

  // UPDATE
  builder.addCase(mountCustomerToUpdate, (state, { payload }) => {
    const customer = state.customers.find(c => c.id === payload);
    if (customer) {
      state.customerToUpdate = customer;
      state.customerFormOpened = true;
    }
  });

  builder
    .addCase(updateCustomer.pending, state => {
      state.customerFormIsLoading = true;
      state.customerFormIsSuccess = false;
      state.customerFormError = null;
    })
    .addCase(updateCustomer.fulfilled, (state, { payload }) => {
      const customerIndex = state.customers.findIndex(c => c.id === payload.id);

      if (customerIndex >= 0) {
        payload.balance = state.customers[customerIndex].balance;
        const newList = state.customers.slice();
        newList.splice(customerIndex, 1, payload);
        state.customers = newList;
      }

      state.customerFormIsLoading = false;
      state.customerFormIsSuccess = true;
    })
    .addCase(updateCustomer.rejected, (state, { payload }) => {
      state.customerFormError = payload as ErrorResponse;
      state.customerFormIsLoading = false;
    });

  // --------------------------------------------------------------------------
  // DELETE
  // --------------------------------------------------------------------------
  builder.addCase(deleteCustomer.fulfilled, (state, { payload }) => {
    if (payload) {
      const { id } = payload;
      const index = state.customers.findIndex(c => c.id === id);
      if (index >= 0) {
        const newList = state.customers.slice();
        newList.splice(index, 1);
        state.customers = newList;
      }
    }
  });

  // --------------------------------------------------------------------------
  // SHOW
  // --------------------------------------------------------------------------
  builder
    .addCase(mountCustomerToFetch, (state, { payload }) => {
      state.fetchCustomerId = payload;
    })
    .addCase(unmountCustomer, state => {
      state.customer = undefined;
      state.fetchCustomerId = undefined;
      state.fetchCustomerError = undefined;
    });

  builder
    .addCase(fetchCustomer.pending, state => {
      state.fetchCustomerError = undefined;
      state.customer = undefined;
    })
    .addCase(fetchCustomer.fulfilled, (state, { payload }) => {
      state.customer = payload;
      state.fetchCustomerId = undefined;
    })
    .addCase(fetchCustomer.rejected, state => {
      state.fetchCustomerError = 'No se pudo recuperar los datos del cliente';
      state.fetchCustomerId = undefined;
    });

  // --------------------------------------------------------------------------
  // STORE PAYMENT
  // --------------------------------------------------------------------------
  builder
    .addCase(mountCustomerToPayment, (state, { payload }) => {
      const customer = state.customers.find(c => c.id === payload);
      if (customer) {
        state.customerToPayment = customer;
        state.paymentFormOpened = true;
      }
    })
    .addCase(unmountCustomerToPayment, state => {
      state.customerToPayment = undefined;
      state.paymentFormOpened = false;
      state.paymentFormLoading = false;
      state.paymentFormIsSuccess = false;
      state.paymnerFormError = null;
    });

  builder
    .addCase(storeCustomerPayment.pending, state => {
      state.paymentFormLoading = true;
      state.paymentFormIsSuccess = false;
      state.paymnerFormError = null;
    })
    .addCase(storeCustomerPayment.fulfilled, state => {
      state.paymentFormLoading = false;
      state.paymentFormIsSuccess = true;
    })
    .addCase(storeCustomerPayment.rejected, (state, { payload }) => {
      state.customerFormError = payload as ErrorResponse;
      state.customerFormIsLoading = false;
    });
});

export default customerPageReducer;
