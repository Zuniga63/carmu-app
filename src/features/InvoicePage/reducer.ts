import { createReducer } from '@reduxjs/toolkit';
import { ErrorResponse } from '../CategoryPage/types';
import {
  fetchInvoiceData,
  hideCounterSaleForm,
  hideNewInvoiceForm,
  hidePaymentForm,
  mountInvoice,
  registerPayment,
  resetSuccess,
  showCounterSaleForm,
  showNewInvoiceForm,
  showPaymentForm,
  storeNewInvoice,
  unmountInvoice,
} from './actions';
import { InvoicePageState } from './types';

const initialState: InvoicePageState = {
  invoices: [],
  customers: [],
  categories: [],
  products: [],
  cashboxs: [],
  loading: true,
  refreshIsSuccess: false,
  // Show invoice
  selectedInvoice: null,
  selectedInvoiceOpened: false,
  selectedInvoiceLoading: false,
  selectedInvoiceError: null,
  // STORE NEW INVOICE
  formOpened: false,
  counterSaleFormOpened: false,
  storeLoading: false,
  storeSuccess: false,
  storeError: null,
  // STORE PAYMENT
  paymentFormOpened: false,
  storePaymentLoading: false,
  storePaymentSuccess: undefined,
  storePaymentError: null,
};

export const invoicePageReducer = createReducer(initialState, builder => {
  // --------------------------------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------------------------------
  builder
    .addCase(fetchInvoiceData.pending, state => {
      state.loading = true;
      state.refreshIsSuccess = false;
    })
    .addCase(fetchInvoiceData.fulfilled, (state, { payload }) => {
      state.refreshIsSuccess = true;
      state.loading = false;
      state.invoices = payload.invoices;
      state.customers = payload.customers;
      state.categories = payload.categories;
      state.products = payload.products;
      state.cashboxs = payload.cashboxs;
    })
    .addCase(fetchInvoiceData.rejected, state => {
      state.loading = false;
    });
  // --------------------------------------------------------------------------
  // NEW INVOICE
  // --------------------------------------------------------------------------
  builder
    .addCase(showNewInvoiceForm, state => {
      state.formOpened = true;
    })
    .addCase(hideNewInvoiceForm, state => {
      state.formOpened = false;
    })
    .addCase(showCounterSaleForm, state => {
      state.counterSaleFormOpened = true;
    })
    .addCase(hideCounterSaleForm, state => {
      state.counterSaleFormOpened = false;
    });

  builder
    .addCase(storeNewInvoice.pending, state => {
      state.storeLoading = true;
      state.storeError = null;
      state.storeSuccess = false;
    })
    .addCase(storeNewInvoice.fulfilled, (state, { payload }) => {
      state.invoices.push(payload);
      state.storeSuccess = true;
      state.storeLoading = false;
    })
    .addCase(storeNewInvoice.rejected, (state, { payload }) => {
      state.storeLoading = false;
      state.storeError = payload;
    });

  // --------------------------------------------------------------------------
  // MOUNT INVOICE
  // --------------------------------------------------------------------------
  builder
    .addCase(mountInvoice.pending, state => {
      state.selectedInvoice = null;
      state.selectedInvoiceOpened = true;
      state.selectedInvoiceLoading = true;
      state.selectedInvoiceError = null;
    })
    .addCase(mountInvoice.fulfilled, (state, { payload }) => {
      state.selectedInvoice = payload;
      state.selectedInvoiceLoading = false;
    })
    .addCase(mountInvoice.rejected, (state, { payload }) => {
      state.selectedInvoiceLoading = false;
      state.selectedInvoiceError = payload as string | null;
    })
    .addCase(unmountInvoice, state => {
      state.selectedInvoiceOpened = false;
    });

  // --------------------------------------------------------------------------
  // PAY INVOICE
  // --------------------------------------------------------------------------
  builder
    .addCase(showPaymentForm, state => {
      state.paymentFormOpened = true;
      state.storePaymentLoading = false;
      state.storePaymentSuccess = undefined;
      state.storePaymentError = null;
    })
    .addCase(hidePaymentForm, state => {
      state.paymentFormOpened = false;
    });

  builder
    .addCase(registerPayment.pending, state => {
      state.storePaymentLoading = true;
      state.storePaymentSuccess = undefined;
      state.storePaymentError = null;
    })
    .addCase(registerPayment.fulfilled, (state, { payload }) => {
      const invoice = state.invoices.find(
        item => item.id === payload.invoice.id
      );

      if (invoice) invoice.balance = payload.invoice.balance;
      state.selectedInvoice = payload.invoice;
      state.storePaymentSuccess = payload.message;
    })
    .addCase(registerPayment.rejected, (state, { payload }) => {
      state.storePaymentLoading = false;
      state.storeError = payload as ErrorResponse | null;
    });
  // --------------------------------------------------------------------------
  // UTILS
  // --------------------------------------------------------------------------
  builder.addCase(resetSuccess, state => {
    state.storeSuccess = false;
    state.refreshIsSuccess = false;
    state.storePaymentSuccess = undefined;
  });
});

export default invoicePageReducer;
