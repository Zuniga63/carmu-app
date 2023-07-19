import { IInvoice, IInvoiceBase, IInvoiceBaseFull, IInvoiceFull } from 'src/types';
import colorLib, { Color, RGBA } from '@kurkle/color';
import dayjs from 'dayjs';

export function normalizeText(text: string): string {
  return text
    ? text
        .trim()
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
}

//-----------------------------------------------------------------------------
// INVOICE UTILS
//-----------------------------------------------------------------------------
export const createSearch = (invoice: IInvoiceBase | IInvoiceBaseFull) => {
  const search = `
  #${invoice.prefixNumber}#
  ${invoice.customer ? invoice.customer.fullName : invoice.customerName} 
  ${invoice.customerAddress} 
  ${invoice.customerDocument} 
  ${invoice.customerPhone}
  $${invoice.amount}$
  ${currencyFormat(invoice.amount)}
  `;

  return normalizeText(search);
};

export const createInvoiceDates = (invoice: IInvoiceBase | IInvoiceBaseFull) => {
  const { expeditionDate, expirationDate, createdAt, updatedAt } = invoice;
  return {
    expeditionDate: dayjs(expeditionDate),
    expirationDate: dayjs(expirationDate),
    createdAt: dayjs(createdAt),
    updatedAt: dayjs(updatedAt),
  };
};

export const buildInvoice = (invoice: IInvoiceBase): IInvoice => {
  const search = createSearch(invoice);
  const dates = createInvoiceDates(invoice);
  return {
    ...invoice,
    ...dates,
    search,
  };
};

export const buildInvoiceFull = (invoice: IInvoiceBaseFull): IInvoiceFull => {
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
//-----------------------------------------------------------------------------
// UTIL FOR FORMAT CURRENCY
//-----------------------------------------------------------------------------
export function currencyFormat(value: string | number | undefined, fractionDigits = 0): string {
  const parseValue = parseFloat(String(value));

  if (!isNaN(parseValue)) {
    const style = 'currency';
    const currency = 'COP';
    const formarter = new Intl.NumberFormat('es-CO', {
      style,
      currency,
      minimumFractionDigits: fractionDigits,
    });

    // if (typeof value === 'string') {
    //   const parseValue = parseFloat(value);
    //   if (Number.isNaN(parseValue)) {
    //     return value.toString();
    //   }

    //   return formarter.format(parseValue);
    // }

    return formarter.format(parseValue);
  }

  return String(value);
}

//-----------------------------------------------------------------------------
// UTIL FOR CHARTS
//-----------------------------------------------------------------------------
export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export enum ChartPeriod {
  annual = 'annual',
  monthly = 'monthly',
}

export const CHART_DATA_PERIODS = [
  { value: ChartPeriod.annual, label: 'Anual' },
  { value: ChartPeriod.monthly, label: 'Mensual' },
];

export const COLORS = [
  'green',
  'red',
  'orange',
  'yellow',
  'blue',
  'purple',
  'violet',
  'raspberry',
  'grey',
  'forestGreen',
  'burgundy',
  'indigo',
];

export const CHART_COLORS = {
  green: 'rgb(75, 192, 192)',
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  violet: '#330036',
  raspberry: '#C42847',
  grey: 'rgb(201, 203, 207)',
  forestGreen: '#138A36',
  burgundy: '#A62639',
  indigo: '#2B4162',
};

export function transparentize(value: string | number[] | Color | RGBA, opacity?: number) {
  const alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}
