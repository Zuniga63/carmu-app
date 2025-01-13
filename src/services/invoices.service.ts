import axios from 'axios';
import dayjs from 'dayjs';
import { ICancelInvoiceData } from '@/components/InvoicePage/CancelInvoiceForm';
import { ICancelPaymentData } from '@/components/InvoicePage/CancelInvoicePaymentForm';
import type {
  IInvoice,
  IInvoiceBase,
  IInvoiceBaseFull,
  IInvoiceFull,
  IInvoicePageData,
  IInvoicePaymentData,
  IInvoiceStoreData,
} from '@/types';
import { createInvoiceDates, createInvoiceSearchProp } from '@/lib/utils';

export const invoiceApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/invoices` });

export function createInvoiceAdapter(invoice: IInvoiceBase): IInvoice {
  const search = createInvoiceSearchProp(invoice);
  const dates = createInvoiceDates(invoice);

  return {
    ...invoice,
    ...dates,
    search,
  };
}

export function createInvoiceFullAdapter(invoice: IInvoiceBaseFull): IInvoiceFull {
  const search = createInvoiceSearchProp(invoice);
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
}

export async function getAllInvoices({ search, invoiceNumber }: { search?: string; invoiceNumber?: string }) {
  const date1 = dayjs().subtract(1, 'week').endOf('day').toDate();
  const date2 = dayjs(date1).add(1, 'day').startOf('day').toDate();

  const [res1, res2] = await Promise.all([
    invoiceApi.get<IInvoicePageData>('', { params: { to: date1, search, invoiceNumber } }),
    invoiceApi.get<IInvoicePageData>('', {
      params: { from: date2, withPayments: true, withItems: true, search, invoiceNumber },
    }),
  ]);

  return [...res1.data.invoices, ...res2.data.invoices].map(createInvoiceAdapter);
}

export async function createInvoice(data: IInvoiceStoreData) {
  const res = await invoiceApi.post<{ invoice: IInvoiceBase }>('', data);
  return createInvoiceAdapter(res.data.invoice);
}

export async function getInvoiceById(id: string) {
  const res = await invoiceApi.get<{ invoice: IInvoiceBaseFull }>(`/${id}`);
  return createInvoiceFullAdapter(res.data.invoice);
}

export async function addInvoicePayment(data: IInvoicePaymentData) {
  const { invoiceId, ...payment } = data;
  const res = await invoiceApi.post<{
    invoice: IInvoiceBaseFull;
    message: string;
  }>(`/${invoiceId}/add-payment`, payment);
  return { ...res.data, invoice: createInvoiceFullAdapter(res.data.invoice) };
}

export async function cancelInvoicePayment(data: ICancelPaymentData) {
  const { invoiceId, paymentId, ...rest } = data;
  const url = `/${invoiceId}/payments/${paymentId}/cancel-payment`;

  const res = await invoiceApi.put<IInvoiceBaseFull>(url, rest);
  return createInvoiceFullAdapter(res.data);
}

export async function cancelInvoice(data: ICancelInvoiceData) {
  const { invoiceId, ...rest } = data;
  const url = `/${invoiceId}/cancel`;

  const res = await invoiceApi.put<IInvoiceBaseFull>(url, rest);
  return createInvoiceFullAdapter(res.data);
}
