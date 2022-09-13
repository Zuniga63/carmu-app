import { IAction, IBoxPageState, IBoxWithDayjs, IMainBox } from 'types';
import {
  ADD_BOX,
  CLOSE_CREATE_BOX_FORM,
  OPEN_CREATE_BOX_FORM,
  REMOVE_BOX,
  SET_BOXES,
  SET_MAIN_BOX,
  STORE_BOX_ERROR,
  STORE_BOX_IS_SUCCESS,
  STORE_BOX_LOADING,
} from './actions';

const initialState: IBoxPageState = {
  boxes: [],
  maiBox: null,
  createFormOpened: false,
  storeBoxLoading: false,
  storeBoxIsSuccess: false,
  storeBoxError: null,
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
    default: {
      return state;
    }
  }
}
