import axios, { AxiosError } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import Swal from 'sweetalert2';
import { AppThunkAction, IBox, IBoxWithDayjs, IMainBox } from 'types';
import { actionBody } from 'utils';
import { REMOVE_BOX, SET_BOXES, SET_MAIN_BOX } from './actions';

const normalizeBox = (box: IBox): IBoxWithDayjs => {
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
  const normalizeBoxes = boxes.map(box => normalizeBox(box));
  return dispatch => {
    dispatch(actionBody(SET_BOXES, normalizeBoxes));
  };
};

export const setMainBox = (mainBox: IMainBox | null): AppThunkAction => {
  return dispatch => {
    dispatch(actionBody(SET_MAIN_BOX, mainBox));
  };
};

export const fetchBoxes = (): AppThunkAction => {
  return async dispatch => {
    try {
      const res = await axios.get<{ boxes: IBox[]; mainBox: IMainBox | null }>('/boxes');
      dispatch(setBoxes(res.data.boxes));
      dispatch(setMainBox(res.data.mainBox));
    } catch (error) {
      console.log(error);
    }
  };
};

export const destroyBox = (boxToDelete: IBoxWithDayjs): AppThunkAction => {
  return async dispatch => {
    const url = `/boxes/${boxToDelete.id}`;
    const message = /*html */ `La caja "<strong>${boxToDelete.name}</strong>" será eliminada permanentemente y esta acción no puede revertirse.`;

    const result = await Swal.fire({
      title: '<strong>¿Desea eliminar la caja?',
      html: message,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, ¡Eliminala!',
      backdrop: true,
      icon: 'warning',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const result = { ok: false, message: '' };
        try {
          const res = await axios.delete(url);
          result.ok = true;
          result.message = `La caja <strong>${res.data.cashbox.name}</strong> fue eliminada con éxito.`;
          dispatch(actionBody(REMOVE_BOX, boxToDelete));
        } catch (error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.status === 404) await dispatch(fetchBoxes());
            result.message = response?.data.message;
          } else {
            console.log(error);
          }
        }

        return result;
      },
    });

    if (result.isConfirmed && result.value) {
      const { ok, message } = result.value;
      if (ok) {
        Swal.fire({
          title: '<strong>¡Caja Eliminada!</strong>',
          html: message,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: '¡Ops, algo salio mal!',
          text: message,
          icon: 'error',
        });
      }
    }
  };
};
