import axios, { AxiosError } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import Swal from 'sweetalert2';
import { AppThunkAction, IBox, IBoxWithDayjs, IMainBox } from 'types';
import { actionBody } from 'utils';
import {
  ADD_BOX,
  CLOSE_BOX_ERROR,
  CLOSE_BOX_IS_SUCCESS,
  CLOSE_BOX_LOADING,
  CLOSE_CREATE_BOX_FORM,
  MOUNT_BOX_TO_CLOSE,
  MOUNT_BOX_TO_OPEN,
  OPEN_BOX_ERROR,
  OPEN_BOX_IS_SUCCESS,
  OPEN_BOX_LOADING,
  OPEN_CREATE_BOX_FORM,
  REMOVE_BOX,
  SET_BOXES,
  SET_MAIN_BOX,
  STORE_BOX_ERROR,
  STORE_BOX_IS_SUCCESS,
  STORE_BOX_LOADING,
  UNMOUNT_BOX_TO_CLOSE,
  UNMOUNT_BOX_TO_OPEN,
  UPDATE_BOX,
} from './actions';

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

export const openCreateForm = (): AppThunkAction => dispatch => dispatch({ type: OPEN_CREATE_BOX_FORM });
export const closeCreateForm = (): AppThunkAction => dispatch => dispatch({ type: CLOSE_CREATE_BOX_FORM });
export const storeBox = (formData: { name: string }): AppThunkAction => {
  return async dispatch => {
    try {
      dispatch(actionBody(STORE_BOX_LOADING, true));
      dispatch(actionBody(STORE_BOX_ERROR, null));

      const res = await axios.post<{ cashbox: IBox }>('/boxes', formData);
      dispatch(actionBody(ADD_BOX, normalizeBox(res.data.cashbox)));
      dispatch(actionBody(STORE_BOX_IS_SUCCESS, true));
    } catch (error) {
      dispatch(actionBody(STORE_BOX_ERROR, error));
    } finally {
      dispatch(actionBody(STORE_BOX_LOADING, false));
      setTimeout(() => {
        dispatch(actionBody(STORE_BOX_IS_SUCCESS, false));
      }, 3000);
    }
  };
};

export const mountBoxToOpen = (boxToOpen: IBoxWithDayjs): AppThunkAction => {
  return dispatch => dispatch(actionBody(MOUNT_BOX_TO_OPEN, boxToOpen));
};

export const unmountBoxToOpen = (): AppThunkAction => dispatch => dispatch({ type: UNMOUNT_BOX_TO_OPEN });

export const openBox = (boxToOpen: IBoxWithDayjs, formData: { base: number; cashierId?: string }): AppThunkAction => {
  return async dispatch => {
    const url = `/boxes/${boxToOpen.id}/open`;
    try {
      dispatch(actionBody(OPEN_BOX_LOADING, true));
      const res = await axios.put<{ cashbox: IBox }>(url, formData);
      const { data } = res;
      const boxWithDates = normalizeBox(data.cashbox);

      dispatch(actionBody(UPDATE_BOX, boxWithDates));
      dispatch(actionBody(OPEN_BOX_IS_SUCCESS, true));
    } catch (error) {
      dispatch(actionBody(OPEN_BOX_ERROR, error));
    } finally {
      dispatch(actionBody(OPEN_BOX_LOADING, false));
      setTimeout(() => dispatch(actionBody(OPEN_BOX_IS_SUCCESS, false)), 3000);
    }
  };
};

export const mountBoxToClose = (boxToClose: IBoxWithDayjs): AppThunkAction => {
  return dispatch => dispatch(actionBody(MOUNT_BOX_TO_CLOSE, boxToClose));
};

export const unmountBoxTOClose = (): AppThunkAction => dispatch => dispatch(actionBody(UNMOUNT_BOX_TO_CLOSE));

export const closeBox = (
  boxToClose: IBoxWithDayjs,
  formData: { cash: number; observation?: string }
): AppThunkAction => {
  return async dispatch => {
    const url = `/boxes/${boxToClose.id}/close`;
    try {
      dispatch(actionBody(CLOSE_BOX_LOADING, true));
      dispatch(actionBody(CLOSE_BOX_ERROR, null));

      const res = await axios.put<{ cashbox: IBox }>(url, formData);
      const box = normalizeBox(res.data.cashbox);

      dispatch(actionBody(UPDATE_BOX, box));
      dispatch(actionBody(CLOSE_BOX_IS_SUCCESS, true));
    } catch (error) {
      dispatch(actionBody(CLOSE_BOX_ERROR, error));
    } finally {
      dispatch(actionBody(CLOSE_BOX_LOADING, false));
    }
  };
};
