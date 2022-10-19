import { IAction } from 'types';
import colorLib, { Color, RGBA } from '@kurkle/color';

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
// UTILS FOR REDUX AND REDUX THUNK
//-----------------------------------------------------------------------------
export const actionBody = (type: string, payload?: unknown): IAction => ({ type, payload });

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
export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
};

export function transparentize(value: string | number[] | Color | RGBA, opacity?: number) {
  const alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}
