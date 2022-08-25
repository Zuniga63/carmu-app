import { IAction } from 'types';

//-----------------------------------------------------------------------------
// UTILS FOR REDUX AND REDUX THUNK
//-----------------------------------------------------------------------------
export const actionBody = (type: string, payload: unknown): IAction => ({ type, payload });
