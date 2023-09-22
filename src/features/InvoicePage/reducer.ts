import { createReducer } from '@reduxjs/toolkit';
import { ErrorResponse } from '../CategoryPage/types';
import {
  cancelInvoice,
  cancelInvoicePayment,
  fetchInvoiceData,
  hideCancelInvoiceForm,
  hideCancelPaymentForm,
  hideCounterSaleForm,
  hideNewInvoiceForm,
  hidePaymentForm,
  hidePrintModal,
  mountInvoice,
  refreshInvoices,
  registerPayment,
  resetSuccess,
  showCancelInvoiceForm,
  showCancelPaymentForm,
  showCounterSaleForm,
  showNewInvoiceForm,
  showPaymentForm,
  showPrintModal,
  storeNewInvoice,
  unmountInvoice,
} from './actions';
import { InvoicePageState } from './types';

const initialState: InvoicePageState = {
  invoices: [],
  invoiceToPrint: undefined,
  products: [],
  firstLoading: true,
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
  // CANCEL PAYEMNT
  paymentToCancel: undefined,
  cancelPaymentFormOpened: false,
  cancelPaymentIsSuccess: false,
  cancelPaymentLoading: false,
  cancelPaymentError: undefined,
  // CANCEL INVOICE
  cancelInvoiceFormOpened: false,
  cancelInvoiceLoading: false,
  cancelInvoiceIsSuccess: false,
  cancelInvoiceError: undefined,
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
      state.firstLoading = false;
      state.invoices = payload.invoices;
      state.products = payload.products;
    })
    .addCase(fetchInvoiceData.rejected, state => {
      state.loading = false;
    });

  builder
    .addCase(refreshInvoices.pending, state => {
      state.loading = true;
      state.refreshIsSuccess = false;
    })
    .addCase(refreshInvoices.fulfilled, (state, { payload }) => {
      state.refreshIsSuccess = true;
      state.loading = false;

      const newInvoices = [...state.invoices];
      payload.forEach(payloadItem => {
        const index = newInvoices.findIndex(({ id }) => id === payloadItem.id);
        if (index >= 0) newInvoices.splice(index, 1, payloadItem);
        else newInvoices.push(payloadItem);
      });

      state.invoices = newInvoices;
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
      state.invoiceToPrint = payload;
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

  builder
    .addCase(hidePrintModal, state => {
      state.invoiceToPrint = undefined;
    })
    .addCase(showPrintModal, (state, { payload }) => {
      state.invoiceToPrint = payload;
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
      const invoice = state.invoices.find(item => item.id === payload.invoice.id);

      if (invoice) invoice.balance = payload.invoice.balance;
      state.selectedInvoice = payload.invoice;
      state.storePaymentSuccess = payload.message;
    })
    .addCase(registerPayment.rejected, (state, { payload }) => {
      state.storePaymentLoading = false;
      state.storeError = payload as ErrorResponse | null;
    });
  // --------------------------------------------------------------------------
  // CANCEL INVOICE PAYMENT
  // --------------------------------------------------------------------------
  builder
    .addCase(showCancelPaymentForm, (state, { payload }) => {
      const { selectedInvoice } = state;
      if (selectedInvoice) {
        const payment = selectedInvoice.payments.find(p => p.id === payload);
        if (payment) {
          state.paymentToCancel = payment;
          state.cancelPaymentFormOpened = true;
        }
      }
    })
    .addCase(hideCancelPaymentForm, state => {
      state.paymentToCancel = undefined;
      state.cancelPaymentFormOpened = false;
      state.cancelPaymentLoading = false;
      state.cancelPaymentIsSuccess = false;
      state.cancelPaymentError = undefined;
    });

  builder
    .addCase(cancelInvoicePayment.pending, state => {
      state.cancelPaymentLoading = true;
      state.cancelPaymentIsSuccess = false;
      state.cancelPaymentError = undefined;
    })
    .addCase(cancelInvoicePayment.fulfilled, (state, { payload }) => {
      state.selectedInvoice = payload;
      state.cancelPaymentLoading = false;
      state.cancelPaymentIsSuccess = true;
    })
    .addCase(cancelInvoicePayment.rejected, (state, { payload }) => {
      state.cancelPaymentLoading = false;
      if (typeof payload === 'string') {
        state.cancelPaymentError = payload;
      }
    });
  // --------------------------------------------------------------------------
  // CANCEL INVOICE PAYMENT
  // --------------------------------------------------------------------------
  builder
    .addCase(showCancelInvoiceForm, state => {
      if (state.selectedInvoice) {
        state.cancelInvoiceFormOpened = true;
      }
    })
    .addCase(hideCancelInvoiceForm, state => {
      state.cancelInvoiceFormOpened = false;
      state.cancelInvoiceLoading = false;
      state.cancelInvoiceIsSuccess = false;
      state.cancelInvoiceError = undefined;
    });

  builder
    .addCase(cancelInvoice.pending, state => {
      state.cancelInvoiceLoading = true;
      state.cancelInvoiceIsSuccess = false;
      state.cancelInvoiceError = undefined;
    })
    .addCase(cancelInvoice.fulfilled, (state, { payload }) => {
      state.cancelInvoiceLoading = false;
      state.cancelInvoiceIsSuccess = true;
      state.selectedInvoice = payload;
    })
    .addCase(cancelInvoice.rejected, (state, { payload }) => {
      state.cancelInvoiceLoading = false;
      if (typeof payload === 'string') {
        state.cancelInvoiceError = payload;
      }
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
