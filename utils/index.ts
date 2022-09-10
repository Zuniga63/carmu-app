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
