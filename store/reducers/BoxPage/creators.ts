import dayjs, { Dayjs } from 'dayjs';
import { AppThunkAction, IBox, IBoxWithDayjs, IMainBox } from 'types';
import { actionBody } from 'utils';
import { SET_BOXES, SET_MAIN_BOX } from './actions';

const nomalizeBox = (box: IBox): IBoxWithDayjs => {
  const now = dayjs();
  const timeUnit = 'minutes';
  const timeDiffs: number[] = [];

  let openBox: Dayjs | undefined, closed: Dayjs | undefined, dateRefreshRate: number | undefined;

  // Convert Date string to Dayjs
  const createdAt = dayjs(box.createdAt);
  timeDiffs.push(now.diff(createdAt, timeUnit));

  const updatedAt = dayjs(box.updatedAt);
  timeDiffs.push(now.diff(updatedAt, timeUnit));

  const createIsSameUpdate = createdAt.isSame(updatedAt);
  const neverUsed = !box.openBox && !box.closed;

  if (box.openBox) {
    openBox = dayjs(box.openBox);
    timeDiffs.push(now.diff(openBox, timeUnit));
  }

  if (box.closed) {
    closed = dayjs(box.closed);
    timeDiffs.push(now.diff(closed, timeUnit));
  }

  if (timeDiffs.length) {
    const minDiff = Math.min(...timeDiffs);

    if (minDiff < 60) dateRefreshRate = 1000 * 60; // each minute
    if (minDiff >= 60 && minDiff < 60 * 24) dateRefreshRate = 1000 * 60 * 60; // each hour
  }

  return { ...box, openBox, closed, createdAt, updatedAt, createIsSameUpdate, neverUsed, dateRefreshRate };
};

export const setBoxes = (boxes: IBox[]): AppThunkAction => {
  const normalizeBoxes = boxes.map(box => nomalizeBox(box));
  return dispatch => {
    dispatch(actionBody(SET_BOXES, normalizeBoxes));
  };
};

export const setMainBox = (mainBox: IMainBox | null): AppThunkAction => {
  return dispatch => {
    dispatch(actionBody(SET_MAIN_BOX, mainBox));
  };
};
