import { IAction, IBoxPageState, IBoxWithDayjs, IMainBox } from 'types';
import { SET_BOXES, SET_MAIN_BOX } from './actions';

const initialState: IBoxPageState = {
  boxes: [],
  maiBox: null,
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
    default: {
      return state;
    }
  }
}
