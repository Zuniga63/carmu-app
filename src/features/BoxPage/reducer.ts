import { createReducer } from '@reduxjs/toolkit';
import { ErrorResponse } from '../CategoryPage/types';
import {
  closeBox,
  fetchBoxes,
  hideCreateForm,
  hideTransactionForm,
  mountBox,
  mountBoxToClose,
  mountBoxToOpen,
  mountGlobalTransactions,
  openBox,
  removeBox,
  removeTransaction,
  showCreateForm,
  showTransactionForm,
  storeBox,
  storeTransaction,
  unmountBoxToClose,
  unmountBoxToOpen,
  unmountTransactions,
} from './actions';
import { BoxPageState } from './types';

const initialState: BoxPageState = {
  boxes: [],
  mainBox: null,
  showingMainBox: false,
  fetchLoading: false,
  fetchIsSuccess: false,
  fetchError: null,
  // add box property
  createFormOpened: false,
  storeBoxLoading: false,
  storeBoxIsSuccess: false,
  storeBoxError: null,
  // open box property
  boxToOpen: undefined,
  openBoxLoading: false,
  openBoxIsSuccess: false,
  openBoxError: null,
  // Close box properties
  boxToClose: undefined,
  closeBoxLoading: false,
  closeBoxIsSuccess: false,
  closeBoxError: null,
  // Show Box
  boxSelected: undefined,
  transactions: [],
  loadingTransactions: false,
  mountBoxIsSuccess: false,
  transactionsError: null,
  // add transaction
  storeTransactionFormOpened: false,
  storeTransactionLoading: false,
  storeTransactionIsSuccess: false,
  storeTransactionError: null,
};

export const boxPageReducer = createReducer(initialState, builder => {
  // --------------------------------------------------------------------------
  // MOUNTH BOXES
  // --------------------------------------------------------------------------
  builder
    .addCase(fetchBoxes.pending, state => {
      state.fetchLoading = true;
      state.fetchError = null;
      state.fetchIsSuccess = false;
      state.showingMainBox = false;
      state.boxSelected = undefined;
      state.transactions = [];
    })
    .addCase(fetchBoxes.fulfilled, (state, { payload }) => {
      state.boxes = payload.boxes;
      state.mainBox = payload.mainBox;
      state.fetchLoading = false;
      state.fetchIsSuccess = true;
    })
    .addCase(fetchBoxes.rejected, state => {
      state.fetchLoading = false;
      state.fetchError = 'No se pudieron cargar las cajas';
    });
  // --------------------------------------------------------------------------
  // CREATE NEW BOXES
  // --------------------------------------------------------------------------
  builder
    .addCase(showCreateForm, state => {
      state.createFormOpened = true;
    })
    .addCase(hideCreateForm, state => {
      state.createFormOpened = false;
      state.storeBoxLoading = false;
      state.storeBoxError = null;
      state.storeBoxIsSuccess = false;
    })
    .addCase(storeBox.pending, state => {
      state.storeBoxLoading = true;
      state.storeBoxError = null;
      state.storeBoxIsSuccess = false;
    })
    .addCase(storeBox.fulfilled, (state, { payload }) => {
      state.boxes.push(payload);
      state.storeBoxIsSuccess = true;
      state.storeBoxLoading = false;
    })
    .addCase(storeBox.rejected, (state, { payload }) => {
      state.storeBoxError = payload as ErrorResponse;
      state.storeBoxLoading = false;
    });
  // --------------------------------------------------------------------------
  // OPEN BOX
  // --------------------------------------------------------------------------
  builder
    .addCase(mountBoxToOpen, (state, { payload }) => {
      state.boxToOpen = state.boxes.find(box => box.id === payload);
    })
    .addCase(unmountBoxToOpen, state => {
      state.boxToOpen = undefined;
      state.openBoxLoading = false;
      state.openBoxIsSuccess = false;
      state.openBoxError = null;
    })
    .addCase(openBox.pending, state => {
      state.openBoxLoading = true;
      state.openBoxIsSuccess = false;
      state.openBoxError = null;
    })
    .addCase(openBox.fulfilled, (state, { payload }) => {
      const index = state.boxes.findIndex(box => box.id === payload.id);
      if (index >= 0) {
        state.boxes.splice(index, 1, payload);
        state.openBoxIsSuccess = true;
      }

      state.openBoxLoading = false;
    })
    .addCase(openBox.rejected, (state, { payload }) => {
      state.openBoxLoading = false;
      state.openBoxError = payload as ErrorResponse;
    });
  // --------------------------------------------------------------------------
  // CLOSE BOX
  // --------------------------------------------------------------------------
  builder
    .addCase(mountBoxToClose, (state, { payload }) => {
      state.boxToClose = state.boxes.find(box => box.id === payload);
    })
    .addCase(unmountBoxToClose, state => {
      state.boxToClose = undefined;
      state.closeBoxLoading = false;
      state.closeBoxIsSuccess = false;
      state.closeBoxError = null;
    })
    .addCase(closeBox.pending, state => {
      state.closeBoxLoading = true;
      state.closeBoxIsSuccess = false;
      state.closeBoxError = null;
    })
    .addCase(closeBox.fulfilled, (state, { payload }) => {
      const index = state.boxes.findIndex(box => box.id === payload.id);
      if (index >= 0) {
        state.boxes.splice(index, 1, payload);
        state.closeBoxIsSuccess = true;
      }

      state.closeBoxLoading = false;
    })
    .addCase(closeBox.rejected, (state, { payload }) => {
      state.closeBoxLoading = false;
      state.closeBoxError = payload as ErrorResponse;
    });
  // --------------------------------------------------------------------------
  // SHOW BOX TRANSACTION
  // --------------------------------------------------------------------------
  builder
    .addCase(mountBox.pending, state => {
      state.loadingTransactions = true;
      state.mountBoxIsSuccess = false;
      state.transactionsError = null;
      state.transactions = [];
      state.showingMainBox = false;
    })
    .addCase(mountBox.fulfilled, (state, { payload }) => {
      state.boxSelected = state.boxes.find(item => item.id === payload.boxId);
      state.transactions = payload.transactions;
      state.mountBoxIsSuccess = true;
      state.loadingTransactions = false;
    })
    .addCase(mountBox.rejected, (state, { payload }) => {
      state.loadingTransactions = false;
      state.transactionsError = payload as ErrorResponse | null;
    });
  // --------------------------------------------------------------------------
  // SHOW MAIN TRANSACTION
  // --------------------------------------------------------------------------
  builder
    .addCase(mountGlobalTransactions.pending, state => {
      state.loadingTransactions = true;
      state.mountBoxIsSuccess = false;
      state.transactionsError = null;
      state.boxSelected = undefined;
      state.transactions = [];
    })
    .addCase(mountGlobalTransactions.fulfilled, (state, { payload }) => {
      state.showingMainBox = true;
      state.transactions = payload;
      state.mountBoxIsSuccess = true;
      state.loadingTransactions = false;
    })
    .addCase(mountGlobalTransactions.rejected, (state, { payload }) => {
      state.loadingTransactions = false;
      state.transactionsError = payload as ErrorResponse | null;
    });
  // --------------------------------------------------------------------------
  // TRANSACTION FORM
  // --------------------------------------------------------------------------
  builder
    .addCase(showTransactionForm, state => {
      state.storeTransactionFormOpened = true;
    })
    .addCase(hideTransactionForm, state => {
      state.storeTransactionFormOpened = false;
      state.storeTransactionLoading = false;
      state.storeTransactionIsSuccess = false;
      state.storeTransactionError = null;
    });

  builder
    .addCase(storeTransaction.pending, state => {
      state.storeTransactionLoading = true;
      state.storeTransactionIsSuccess = false;
      state.storeTransactionError = null;
    })
    .addCase(storeTransaction.fulfilled, (state, { payload }) => {
      const { cashbox } = payload;

      // *Update the balance of box
      if (cashbox) {
        const boxIndex = state.boxes.findIndex(box => box.id === cashbox);
        if (boxIndex >= 0) {
          const box = state.boxes[boxIndex];
          box.balance = (box.balance || 0) + payload.amount;
          state.boxes.splice(boxIndex, 1, box);
          if (state.boxSelected && state.boxSelected.id === box.id) {
            state.boxSelected = box;
          }
        }
      } else if (state.mainBox) {
        state.mainBox.balance += payload.amount;
      }

      state.transactions.push(payload);
      state.storeTransactionIsSuccess = true;
      state.storeTransactionLoading = false;
    })
    .addCase(storeTransaction.rejected, (state, { payload }) => {
      state.storeTransactionLoading = false;
      state.storeTransactionError = payload as ErrorResponse | null;
    });
  // --------------------------------------------------------------------------
  // DELETE
  // --------------------------------------------------------------------------
  builder.addCase(unmountTransactions, state => {
    state.showingMainBox = false;
    state.boxSelected = undefined;
    state.transactions = [];
  });
  builder.addCase(removeBox, (state, { payload }) => {
    state.boxes = state.boxes.filter(box => box.id !== payload);
  });
  builder.addCase(removeTransaction, (state, { payload }) => {
    const { transactions, boxSelected, mainBox, boxes } = state;
    const transactionIndex = transactions.findIndex(({ id }) => id === payload);

    if (transactionIndex >= 0) {
      const transaction = transactions[transactionIndex];
      // Update box balance
      if (transaction.cashbox) {
        const { cashbox, amount } = transaction;
        const boxIndex = boxes.findIndex(({ id }) => id === cashbox);
        if (boxIndex >= 0) {
          const box = boxes[boxIndex];
          box.balance = (box.balance || 0) - amount;

          state.boxes.splice(boxIndex, 1, box);

          if (boxSelected && boxSelected.id === cashbox) {
            state.boxSelected = box;
          }
        }
      } else if (mainBox) {
        mainBox.balance -= transaction.amount;
        state.mainBox = mainBox;
      }

      state.transactions.splice(transactionIndex, 1);
    }
  });
});

export default boxPageReducer;
