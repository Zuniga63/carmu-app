import axios from 'axios';
import dayjs from 'dayjs';
import { AppThunkAction, IInvoice, IInvoiceBase, IInvoicePageData, IInvoiceStoreData } from 'types';
import { actionBody, currencyFormat, normalizeText } from 'utils';
import * as actions from './actions';

export const buildInvoice = (invoice: IInvoiceBase): IInvoice => {
  const { expeditionDate, expirationDate, createdAt, updatedAt } = invoice;
  const date = dayjs(expeditionDate);
  const search = `
    ${invoice.prefixNumber} 
    ${invoice.customer ? invoice.customer.fullName : invoice.customerName} 
    ${invoice.customerAddress} 
    ${invoice.customerDocument} 
    ${invoice.customerPhone}
    ${date.format('DD-MM-YYYY')}
    ${date.format('DD/MM/YYYY')}
    ${invoice.amount}
    ${currencyFormat(invoice.amount)}
    `;
  return {
    ...invoice,
    expeditionDate: dayjs(expeditionDate),
    expirationDate: dayjs(expirationDate),
    createdAt: dayjs(createdAt),
    updatedAt: dayjs(updatedAt),
    search: normalizeText(search),
  };
};

export const mountInvoiceData = (data: IInvoicePageData): AppThunkAction => {
  return dispatch => {
    const invoices = data.invoices.map(invoice => buildInvoice(invoice));
    dispatch(actionBody(actions.MOUNT_DATA, { ...data, invoices }));
  };
};

export const fetchInvoiceData = (): AppThunkAction => {
  return async dispatch => {
    try {
      const res = await axios.get<IInvoicePageData>('/invoices');
      dispatch(mountInvoiceData(res.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const openNewInvoiceForm = (): AppThunkAction => {
  return dispatch => dispatch(actionBody(actions.FORM_NEW_INVOICE_OPENED, true));
};

export const closeNewInvoiceForm = (): AppThunkAction => {
  return dispatch => dispatch(actionBody(actions.FORM_NEW_INVOICE_OPENED, false));
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
