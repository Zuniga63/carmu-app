import dayjs from 'dayjs';
import colorLib, { Color, type RGBA } from '@kurkle/color';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import type { IInvoiceBase, IInvoiceBaseFull } from '@/types';

export function normalizeText(text: string): string {
  return text
    ? text
        .trim()
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
}

/**
 * Build a option for next-cookie
 * @param duration Time in day of duration of cookie in the browser, default 1 day
 * @returns
 */
export const buildCookieOption = (duration = 1) => ({
  path: '/',
  sameSite: true,
  maxAge: 60 * 60 * 24 * duration,
});

/**
 * Se encarga de aplicar las reglas de Tailwind merge y la funcionalidad de clxs
 * @param inputs Los valores de las clases
 * @returns Listado de clases
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//-----------------------------------------------------------------------------
// INVOICE UTILS
//-----------------------------------------------------------------------------
export const createInvoiceSearchProp = (invoice: IInvoiceBase | IInvoiceBaseFull) => {
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
//-----------------------------------------------------------------------------
// UTIL FOR FORMAT CURRENCY
//-----------------------------------------------------------------------------
export function currencyFormat(value: string | number | undefined, fractionDigits = 0): string {
  if (typeof value === 'undefined') return '';

  const parseValue = typeof value === 'string' ? parseFloat(currencyParse(value)) : value;
  if (isNaN(parseValue)) return '';

  const formarter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: fractionDigits,
  });

  return formarter.format(parseValue);
}

export function currencyParse(value: string, decimalSeparator: '.' | ',' = ',') {
  const exp = decimalSeparator === '.' ? /\$\s?|(,*)/g : /\$\s?|(\.*)/g;
  return value.replace(exp, '').replaceAll(decimalSeparator, '.');
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
