import dayjs, { Dayjs } from 'dayjs';
import { IBox, IBoxWithDayjs } from 'src/types';

export const normalizeBox = (box: IBox | IBoxWithDayjs): IBoxWithDayjs => {
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

  return {
    ...box,
    openBox,
    closed,
    createdAt,
    updatedAt,
    createIsSameUpdate,
    neverUsed,
    dateRefreshRate,
  };
};

export default normalizeBox;
