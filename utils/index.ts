import { IAction } from 'types';

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
  if (value) {
    const style = 'currency';
    const currency = 'COP';
    const formarter = new Intl.NumberFormat('es-CO', {
      style,
      currency,
      minimumFractionDigits: fractionDigits,
    });

    if (typeof value === 'string') {
      const parseValue = parseFloat(value);
      if (Number.isNaN(parseValue)) {
        return value.toString();
      }

      return formarter.format(parseValue);
    }

    return formarter.format(value);
  }

  return String(value);
}
