import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

//-----------------------------------------------------------------------------
// TYPES OF REDUX AND REDUX THUNK
//-----------------------------------------------------------------------------
export interface IAction {
  type: string;
  payload: unknown;
}

export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>;
export type AppThunkAction = ThunkAction<void, unknown, unknown, AnyAction>;
