import { IAction, IBoxPageState, IBoxWithDayjs, IMainBox } from 'types';
import { REMOVE_BOX, SET_BOXES, SET_MAIN_BOX } from './actions';

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
    case REMOVE_BOX: {
      const boxDeleted = action.payload as IBoxWithDayjs;
      const newList = state.boxes.filter(box => box.id !== boxDeleted.id);

      return {
        ...state,
        boxes: newList,
      };
    }
    default: {
      return state;
    }
  }
}
