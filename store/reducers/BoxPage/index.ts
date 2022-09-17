import { IAction, IBoxPageState, IBoxWithDayjs, IMainBox } from 'types';
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

const initialState: IBoxPageState = {
  boxes: [],
  maiBox: null,
  // add box property
  createFormOpened: false,
  storeBoxLoading: false,
  storeBoxIsSuccess: false,
  storeBoxError: null,
  // open box property
  boxToOpen: null,
  openBoxLoading: false,
  openBoxIsSuccess: false,
  openBoxError: null,
  // Close box properties
  boxToClose: null,
  closeBoxLoading: false,
  closeBoxIsSuccess: false,
  closeBoxError: null,
};

export default function BoxPageReducer(state = initialState, action: IAction): IBoxPageState {
  switch (action.type) {
    case SET_BOXES: {
      return {
        ...state,
        boxes: action.payload as IBoxWithDayjs[],
      };
    }
    case SET_MAIN_BOX: {
      return {
        ...state,
        maiBox: action.payload as IMainBox | null,
      };
    }
    case REMOVE_BOX: {
      const boxDeleted = action.payload as IBoxWithDayjs;
      const newList = state.boxes.filter(box => box.id !== boxDeleted.id);

      return {
        ...state,
        boxes: newList,
      };
    }
    case UPDATE_BOX: {
      const boxToUpdate = action.payload as IBoxWithDayjs;
      const boxes = state.boxes.slice();
      const index = boxes.findIndex(box => box.id === boxToUpdate.id);

      if (index >= 0) {
        boxes.splice(index, 1, boxToUpdate);
        return { ...state, boxes };
      }

      return state;
    }
    //-------------------------------------------------------------------------
    // CASES FOR STORE A NEW BOX
    //-------------------------------------------------------------------------
    case OPEN_CREATE_BOX_FORM: {
      return {
        ...state,
        createFormOpened: true,
      };
    }
    case CLOSE_CREATE_BOX_FORM: {
      return {
        ...state,
        createFormOpened: false,
        storeBoxLoading: false,
        storeBoxIsSuccess: false,
        storeBoxError: null,
      };
    }
    case STORE_BOX_LOADING: {
      return {
        ...state,
        storeBoxLoading: action.payload as boolean,
      };
    }
    case STORE_BOX_IS_SUCCESS: {
      return {
        ...state,
        storeBoxIsSuccess: action.payload as boolean,
      };
    }
    case STORE_BOX_ERROR: {
      return {
        ...state,
        storeBoxError: action.payload,
      };
    }
    case ADD_BOX: {
      return {
        ...state,
        boxes: [...state.boxes, action.payload as IBoxWithDayjs],
      };
    }
    //-------------------------------------------------------------------------
    // CASES FOR OPEN BOX
    //-------------------------------------------------------------------------
    case MOUNT_BOX_TO_OPEN: {
      return {
        ...state,
        boxToOpen: action.payload as IBoxWithDayjs,
      };
    }
    case UNMOUNT_BOX_TO_OPEN: {
      return {
        ...state,
        boxToOpen: null,
        openBoxLoading: false,
        openBoxIsSuccess: false,
        openBoxError: null,
      };
    }
    case OPEN_BOX_LOADING: {
      return { ...state, openBoxLoading: action.payload as boolean };
    }
    case OPEN_BOX_IS_SUCCESS: {
      return { ...state, openBoxIsSuccess: action.payload as boolean };
    }
    case OPEN_BOX_ERROR: {
      return { ...state, openBoxError: action.payload };
    }
    //-------------------------------------------------------------------------
    // CASES FOR CLOSE BOX
    //-------------------------------------------------------------------------
    case MOUNT_BOX_TO_CLOSE: {
      return {
        ...state,
        boxToClose: action.payload as IBoxWithDayjs,
      };
    }
    case UNMOUNT_BOX_TO_CLOSE: {
      return {
        ...state,
        boxToClose: null,
        closeBoxLoading: false,
        closeBoxIsSuccess: false,
        closeBoxError: null,
      };
    }
    case CLOSE_BOX_LOADING: {
      return { ...state, closeBoxLoading: action.payload as boolean };
    }
    case CLOSE_BOX_IS_SUCCESS: {
      return { ...state, closeBoxIsSuccess: action.payload as boolean };
    }
    case CLOSE_BOX_ERROR: {
      return { ...state, closeBoxError: action.payload };
    }
    default: {
      return state;
    }
  }
}
