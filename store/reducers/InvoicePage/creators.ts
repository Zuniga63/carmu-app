import axios from 'axios';
import dayjs from 'dayjs';
import {
  AppThunkAction,
  IInvoice,
  IInvoiceBase,
  IInvoiceBaseFull,
  IInvoiceFull,
  IInvoicePageData,
  IInvoicePaymentData,
  IInvoiceStoreData,
} from 'types';
import { actionBody, currencyFormat, normalizeText } from 'utils';
import * as actions from './actions';

// --------------------------------------------------------------------------------------
// UTILS
// --------------------------------------------------------------------------------------
const createSearch = (invoice: IInvoiceBase | IInvoiceBaseFull) => {
  const search = `
  ${invoice.prefixNumber} 
  ${invoice.customer ? invoice.customer.fullName : invoice.customerName} 
  ${invoice.customerAddress} 
  ${invoice.customerDocument} 
  ${invoice.customerPhone}
  ${invoice.amount}
  ${currencyFormat(invoice.amount)}
  `;

  return normalizeText(search);
};

const createInvoiceDates = (invoice: IInvoiceBase | IInvoiceBaseFull) => {
  const { expeditionDate, expirationDate, createdAt, updatedAt } = invoice;
  return {
    expeditionDate: dayjs(expeditionDate),
    expirationDate: dayjs(expirationDate),
    createdAt: dayjs(createdAt),
    updatedAt: dayjs(updatedAt),
  };
};

const buildInvoice = (invoice: IInvoiceBase): IInvoice => {
  const search = createSearch(invoice);
  const dates = createInvoiceDates(invoice);
  return {
    ...invoice,
    ...dates,
    search,
  };
};

const buildInvoiceFull = (invoice: IInvoiceBaseFull): IInvoiceFull => {
  const search = createSearch(invoice);
  const dates = createInvoiceDates(invoice);
  const payments = invoice.payments.map(payment => ({
    ...payment,
    paymentDate: dayjs(payment.paymentDate),
    createdAt: dayjs(payment.createdAt),
    updatedAt: dayjs(payment.updatedAt),
  }));

  return {
    ...invoice,
    ...dates,
    payments,
    search,
  };
};

// --------------------------------------------------------------------------------------
// REDUCERS
// --------------------------------------------------------------------------------------

export const mountInvoiceData = (data: IInvoicePageData): AppThunkAction => {
  return dispatch => {
    const invoices = data.invoices.map(invoice => buildInvoice(invoice));
    dispatch(actionBody(actions.MOUNT_DATA, { ...data, invoices }));
  };
};

export const fetchInvoiceData = (): AppThunkAction => {
  return async dispatch => {
    dispatch(actionBody(actions.LOADING_DATA, true));
    dispatch(actionBody(actions.REFRESH_IS_SUCCESS, false));

    try {
      const res = await axios.get<IInvoicePageData>('/invoices');
      dispatch(mountInvoiceData(res.data));
      dispatch(actionBody(actions.REFRESH_IS_SUCCESS, true));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(actionBody(actions.LOADING_DATA, false));
      setTimeout(() => {
        dispatch(actionBody(actions.REFRESH_IS_SUCCESS, false));
      }, 250);
    }
  };
};

export const openNewInvoiceForm = (): AppThunkAction => {
  return dispatch => dispatch(actionBody(actions.FORM_NEW_INVOICE_OPENED, true));
};

export const closeNewInvoiceForm = (): AppThunkAction => {
  return dispatch => dispatch(actionBody(actions.FORM_NEW_INVOICE_OPENED, false));
};

export const openCounterSaleForm = (): AppThunkAction => {
  return dispatch => dispatch(actionBody(actions.COUNTER_SALE_FORM_OPENED, true));
};

export const closeCounterSaleForm = (): AppThunkAction => {
  return dispatch => dispatch(actionBody(actions.COUNTER_SALE_FORM_OPENED, false));
};

export const storeNewInvoice = (invoiceData: IInvoiceStoreData): AppThunkAction => {
  return async dispatch => {
    try {
      // Start Loading
      dispatch(actionBody(actions.INVOICE_STORE_LOADING, true));
      dispatch(actionBody(actions.INVOICE_STORE_ERROR, null));
      // Request
      const res = await axios.post<{ invoice: IInvoiceBase }>('/invoices', invoiceData);
      const invoice = buildInvoice(res.data.invoice);
      dispatch(actionBody(actions.ADD_NEW_INVOICE, invoice));
      dispatch(actionBody(actions.INVOICE_STORE_SUCCESS, true));
    } catch (error) {
      dispatch(actionBody(actions.INVOICE_STORE_ERROR, error));
    } finally {
      dispatch(actionBody(actions.INVOICE_STORE_LOADING, false));
      setTimeout(() => {
        dispatch(actionBody(actions.INVOICE_STORE_SUCCESS, false));
      }, 2000);
    }
  };
};

export const mountInvoice = (invoiceId: string): AppThunkAction => {
  return async dispatch => {
    try {
      dispatch(actionBody(actions.SELECTED_INVOICE_OPENED, true));
      dispatch(actionBody(actions.SELECTED_INVOICE_LOADING, true));
      dispatch(actionBody(actions.SELECTED_INVOICE_ERROR, null));

      const res = await axios.get(`/invoices/${invoiceId}`);
      const invoice = buildInvoiceFull(res.data.invoice);
      dispatch(actionBody(actions.MOUNT_SELECTED_INVOICE, invoice));
    } catch (error) {
      const msg = 'No se pudo recuperar la factura.';
      dispatch(actionBody(actions.SELECTED_INVOICE_ERROR, msg));
      console.log(error);
    } finally {
      dispatch(actionBody(actions.SELECTED_INVOICE_LOADING, false));
    }
  };
};

export const unmountSelectedInvoice = (): AppThunkAction => {
  return dispatch => {
    dispatch(actionBody(actions.SELECTED_INVOICE_OPENED, false));
    dispatch(actionBody(actions.SELECTED_INVOICE_LOADING, false));
    dispatch(actionBody(actions.SELECTED_INVOICE_ERROR, null));

    setTimeout(() => {
      dispatch(actionBody(actions.UNMOUNT_SELECTED_INVOICE));
    }, 250);
  };
};

export const openPaymentForm = (): AppThunkAction => {
  return dispatch => {
    dispatch(actionBody(actions.PAYMENT_FORM_OPENED, true));
  };
};

export const closePaymentForm = (): AppThunkAction => {
  return dispatch => {
    dispatch(actionBody(actions.PAYMENT_FORM_OPENED, false));
  };
};

export const registerPayment = (paymentData: IInvoicePaymentData, invoiceId: string): AppThunkAction => {
  return async dispatch => {
    dispatch(actionBody(actions.PAYMENT_STORE_LOADING, true));
    dispatch(actionBody(actions.PAYMENT_STORE_ERROR, null));

    try {
      const url = `/invoices/${invoiceId}/add-payment`;
      const res = await axios.post<{ invoice: IInvoiceBaseFull; message: string }>(url, paymentData);
      const invoice = buildInvoiceFull(res.data.invoice);
      dispatch(actionBody(actions.ADD_PAYMENT_TO_INVOICE, invoice));
      dispatch(actionBody(actions.PAYMENT_STORE_SUCCESS, res.data.message));
    } catch (error) {
      dispatch(actionBody(actions.PAYMENT_STORE_ERROR, error));
    } finally {
      dispatch(actionBody(actions.PAYMENT_STORE_LOADING, false));
      setTimeout(() => {
        dispatch(actionBody(actions.PAYMENT_STORE_SUCCESS, undefined));
      }, 2000);
    }
  };
};
