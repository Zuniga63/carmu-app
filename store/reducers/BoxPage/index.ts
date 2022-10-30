import { IAction, IBoxPageState, IBoxWithDayjs, IMainBox, ITransaction, ITransactionResponse } from 'types';
import * as ACTIONS from './actions';

const initialState: IBoxPageState = {
  boxes: [],
  mainBox: null,
  showingMainBox: false,
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
  // Show Box
  boxSelected: null,
  loadingTransactions: false,
  transactions: [],
  transactionsError: null,
  // add transaction
  storeTransactionFormOpened: false,
  storeTransactionLoading: false,
  storeTransactionIsSuccess: false,
  storeTransactionError: null,
};

const unmountBoxSelectedToState = (state: IBoxPageState): IBoxPageState => {
  return {
    ...state,
    showingMainBox: false,
    boxSelected: null,
    loadingTransactions: false,
    transactions: [],
    transactionsError: null,
  };
};

export default function BoxPageReducer(state = initialState, action: IAction): IBoxPageState {
  switch (action.type) {
    case ACTIONS.SET_BOXES: {
      let boxSelected: IBoxWithDayjs | undefined;
      const newBoxes = action.payload as IBoxWithDayjs[];

      if (state && state.boxSelected) {
        const id = state.boxSelected.id;
        boxSelected = newBoxes.find(box => box.id === id);
      }

      return {
        ...state,
        boxes: action.payload as IBoxWithDayjs[],
        boxSelected: boxSelected ? boxSelected : null,
      };
    }
    case ACTIONS.SET_MAIN_BOX: {
      return {
        ...state,
        mainBox: action.payload as IMainBox | null,
      };
    }
    case ACTIONS.REMOVE_BOX: {
      const boxDeleted = action.payload as IBoxWithDayjs;
      const newList = state.boxes.filter(box => box.id !== boxDeleted.id);

      return {
        ...state,
        boxes: newList,
      };
    }
    case ACTIONS.UPDATE_BOX: {
      const boxToUpdate = action.payload as IBoxWithDayjs;
      const boxes = state.boxes.slice();
      const index = boxes.findIndex(box => box.id === boxToUpdate.id);
      let newState = state;

      if (index >= 0) {
        boxes.splice(index, 1, boxToUpdate);
        newState = { ...state, boxes };
        if (state.boxSelected && state.boxSelected.id === boxToUpdate.id && !boxToUpdate.openBox) {
          newState = unmountBoxSelectedToState(newState);
        }
      }

      return newState;
    }
    case ACTIONS.UPDATE_MAIN_BOX_BALANCE: {
      const { mainBox } = state;
      if (mainBox) {
        const balance = mainBox.balance + (action.payload as number);
        return {
          ...state,
          mainBox: { ...mainBox, balance: balance },
        };
      }

      return state;
    }
    case ACTIONS.MOUNT_MAIN_TRANSACTIONS: {
      return { ...state, showingMainBox: true };
    }
    //-------------------------------------------------------------------------
    // CASES FOR STORE A NEW BOX
    //-------------------------------------------------------------------------
    case ACTIONS.OPEN_CREATE_BOX_FORM: {
      return {
        ...state,
        createFormOpened: true,
      };
    }
    case ACTIONS.CLOSE_CREATE_BOX_FORM: {
      return {
        ...state,
        createFormOpened: false,
        storeBoxLoading: false,
        storeBoxIsSuccess: false,
        storeBoxError: null,
      };
    }
    case ACTIONS.STORE_BOX_LOADING: {
      return {
        ...state,
        storeBoxLoading: action.payload as boolean,
      };
    }
    case ACTIONS.STORE_BOX_IS_SUCCESS: {
      return {
        ...state,
        storeBoxIsSuccess: action.payload as boolean,
      };
    }
    case ACTIONS.STORE_BOX_ERROR: {
      return {
        ...state,
        storeBoxError: action.payload,
      };
    }
    case ACTIONS.ADD_BOX: {
      return {
        ...state,
        boxes: [...state.boxes, action.payload as IBoxWithDayjs],
      };
    }
    //-------------------------------------------------------------------------
    // CASES FOR OPEN BOX
    //-------------------------------------------------------------------------
    case ACTIONS.MOUNT_BOX_TO_OPEN: {
      return {
        ...state,
        boxToOpen: action.payload as IBoxWithDayjs,
      };
    }
    case ACTIONS.UNMOUNT_BOX_TO_OPEN: {
      return {
        ...state,
        boxToOpen: null,
        openBoxLoading: false,
        openBoxIsSuccess: false,
        openBoxError: null,
      };
    }
    case ACTIONS.OPEN_BOX_LOADING: {
      return { ...state, openBoxLoading: action.payload as boolean };
    }
    case ACTIONS.OPEN_BOX_IS_SUCCESS: {
      return { ...state, openBoxIsSuccess: action.payload as boolean };
    }
    case ACTIONS.OPEN_BOX_ERROR: {
      return { ...state, openBoxError: action.payload };
    }
    //-------------------------------------------------------------------------
    // CASES FOR CLOSE BOX
    //-------------------------------------------------------------------------
    case ACTIONS.MOUNT_BOX_TO_CLOSE: {
      return {
        ...state,
        boxToClose: action.payload as IBoxWithDayjs,
      };
    }
    case ACTIONS.UNMOUNT_BOX_TO_CLOSE: {
      return {
        ...state,
        boxToClose: null,
        closeBoxLoading: false,
        closeBoxIsSuccess: false,
        closeBoxError: null,
      };
    }
    case ACTIONS.CLOSE_BOX_LOADING: {
      return { ...state, closeBoxLoading: action.payload as boolean };
    }
    case ACTIONS.CLOSE_BOX_IS_SUCCESS: {
      return { ...state, closeBoxIsSuccess: action.payload as boolean };
    }
    case ACTIONS.CLOSE_BOX_ERROR: {
      return { ...state, closeBoxError: action.payload };
    }
    //-------------------------------------------------------------------------
    // CASES FOR SHOW BOX
    //-------------------------------------------------------------------------
    case ACTIONS.MOUNT_SELECTED_BOX: {
      return {
        ...state,
        boxSelected: action.payload as IBoxWithDayjs,
      };
    }
    case ACTIONS.UNMOUT_SELECTED_BOX: {
      return unmountBoxSelectedToState(state);
    }
    case ACTIONS.MOUNT_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.payload as ITransaction[],
      };
    }
    case ACTIONS.UNMOUNT_TRANSACTIONS: {
      return { ...state, transactions: [], showingMainBox: false };
    }
    case ACTIONS.LOADING_TRANSACTIONS: {
      return { ...state, loadingTransactions: action.payload as boolean };
    }
    case ACTIONS.GET_TRANSACTIONS_ERROR: {
      return { ...state, transactionsError: action.payload };
    }
    //-------------------------------------------------------------------------
    // CASE FOR ADD NEW TRANSACTIONS
    //-------------------------------------------------------------------------
    case ACTIONS.SHOW_CREATE_TRANSACTION_FORM: {
      return { ...state, storeTransactionFormOpened: true };
    }
    case ACTIONS.HIDE_CREATE_TRANSACTION_FORM: {
      return {
        ...state,
        storeTransactionFormOpened: false,
        storeTransactionIsSuccess: false,
        storeTransactionLoading: false,
        storeTransactionError: null,
      };
    }
    case ACTIONS.STORE_TRANSACTION_LOADING: {
      return { ...state, storeTransactionLoading: action.payload as boolean };
    }
    case ACTIONS.STORE_TRANSACTION_IS_SUCCESS: {
      return { ...state, storeTransactionIsSuccess: action.payload as boolean };
    }
    case ACTIONS.STORE_TRANSACTION_ERROR: {
      return { ...state, storeTransactionError: action.payload };
    }
    case ACTIONS.ADD_TRANSACTION: {
      const newTransaction = action.payload as ITransaction;
      const { boxSelected, transactions, mainBox } = state;
      let newState = state;

      if ((boxSelected && boxSelected.id === newTransaction.cashbox) || mainBox) {
        newState = { ...state, transactions: [...transactions, newTransaction] };
      }

      return newState;
    }
    case ACTIONS.REMOVE_TRANSACTION: {
      const transactionDeleted = action.payload as ITransactionResponse;
      const { boxSelected, transactions } = state;
      let newState = state;

      if (boxSelected) {
        let balance = boxSelected.base;
        const newTransactions = transactions
          .filter(item => item.id !== transactionDeleted.id)
          .map(item => {
            balance += item.amount;
            return { ...item, balance };
          });

        newState = {
          ...state,
          // boxSelected: { ...boxSelected, balance, updatedAt: dayjs(), dateRefreshRate: 1000 * 60 },
          transactions: newTransactions,
        };
      }

      return newState;
    }
    default: {
      return state;
    }
  }
}
