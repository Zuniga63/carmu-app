import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { AppDispatch } from 'types';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
