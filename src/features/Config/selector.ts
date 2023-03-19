import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';

export const configState = (state: RootState) => state.configState;
export const configSelector = createSelector(configState, state => state);
