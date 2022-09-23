import { IAction, IBoxPageState, IBoxWithDayjs, IMainBox, ITransaction, ITransactionResponse } from 'types';
import {
  ADD_BOX,
  ADD_TRANSACTION,
  CLOSE_BOX_ERROR,
  CLOSE_BOX_IS_SUCCESS,
  CLOSE_BOX_LOADING,
  CLOSE_CREATE_BOX_FORM,
  GET_TRANSACTIONS_ERROR,
  HIDE_CREATE_TRANSACTION_FORM,
  LOADING_TRANSACTIONS,
  MOUNT_BOX_TO_CLOSE,
  MOUNT_BOX_TO_OPEN,
  MOUNT_MAIN_TRANSACTIONS,
  MOUNT_SELECTED_BOX,
  MOUNT_TRANSACTIONS,
  OPEN_BOX_ERROR,
  OPEN_BOX_IS_SUCCESS,
  OPEN_BOX_LOADING,
  OPEN_CREATE_BOX_FORM,
  REMOVE_BOX,
  REMOVE_TRANSACTION,
  SET_BOXES,
  SET_MAIN_BOX,
  SHOW_CREATE_TRANSACTION_FORM,
  STORE_BOX_ERROR,
  STORE_BOX_IS_SUCCESS,
  STORE_BOX_LOADING,
  STORE_TRANSACTION_ERROR,
  STORE_TRANSACTION_IS_SUCCESS,
  STORE_TRANSACTION_LOADING,
  UNMOUNT_BOX_TO_CLOSE,
  UNMOUNT_BOX_TO_OPEN,
  UNMOUT_SELECTED_BOX,
  UPDATE_BOX,
  UPDATE_MAIN_BOX_BALANCE,
} from './actions';

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
    case SET_BOXES: {
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
    case SET_MAIN_BOX: {
      return {
        ...state,
        mainBox: action.payload as IMainBox | null,
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
    case UPDATE_MAIN_BOX_BALANCE: {
      const { mainBox } = state;
      if (mainBox) {
        return {
          ...state,
          mainBox: { ...mainBox, balance: mainBox.balance + (action.payload as number) },
        };
      }

      return state;
    }
    case MOUNT_MAIN_TRANSACTIONS: {
      return { ...state, showingMainBox: true };
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
    //-------------------------------------------------------------------------
    // CASES FOR SHOW BOX
    //-------------------------------------------------------------------------
    case MOUNT_SELECTED_BOX: {
      return {
        ...state,
        boxSelected: action.payload as IBoxWithDayjs,
      };
    }
    case UNMOUT_SELECTED_BOX: {
      return unmountBoxSelectedToState(state);
    }
    case MOUNT_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.payload as ITransaction[],
      };
    }
    case LOADING_TRANSACTIONS: {
      return { ...state, loadingTransactions: action.payload as boolean };
    }
    case GET_TRANSACTIONS_ERROR: {
      return { ...state, transactionsError: action.payload };
    }
    //-------------------------------------------------------------------------
    // CASE FOR ADD NEW TRANSACTIONS
    //-------------------------------------------------------------------------
    case SHOW_CREATE_TRANSACTION_FORM: {
      return { ...state, storeTransactionFormOpened: true };
    }
    case HIDE_CREATE_TRANSACTION_FORM: {
      return {
        ...state,
        storeTransactionFormOpened: false,
        storeTransactionIsSuccess: false,
        storeTransactionLoading: false,
        storeTransactionError: null,
      };
    }
    case STORE_TRANSACTION_LOADING: {
      return { ...state, storeTransactionLoading: action.payload as boolean };
    }
    case STORE_TRANSACTION_IS_SUCCESS: {
      return { ...state, storeTransactionIsSuccess: action.payload as boolean };
    }
    case STORE_TRANSACTION_ERROR: {
      return { ...state, storeTransactionError: action.payload };
    }
    case ADD_TRANSACTION: {
      const newTransaction = action.payload as ITransaction;
      const { boxSelected, transactions, mainBox } = state;
      let newState = state;

      if ((boxSelected && boxSelected.id === newTransaction.cashbox) || mainBox) {
        newState = { ...state, transactions: [...transactions, newTransaction] };
      }

      return newState;
    }
    case REMOVE_TRANSACTION: {
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
