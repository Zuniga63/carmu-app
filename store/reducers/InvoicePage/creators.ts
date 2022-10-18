import axios from 'axios';
import dayjs from 'dayjs';
import { AppThunkAction, IInvoiceBase, IInvoicePageData } from 'types';
import { actionBody, currencyFormat, normalizeText } from 'utils';
import * as actions from './actions';

export const buildInvoice = (invoice: IInvoiceBase) => {
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
