import { Button, ScrollArea } from '@mantine/core';
import { IconWriting } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { showCreateTransactionForm } from 'store/reducers/BoxPage/creators';
import { currencyFormat } from 'utils';
import CreateTransactionForm from './CreateTransactionForm';
import TransactionTable from './TransactionTable';
import WaitingBox from './WaitingBox';

const BoxShow = () => {
  const {
    boxSelected,
    mainBox,
    showingMainBox,
    loadingTransactions: loading,
    transactions,
  } = useAppSelector(state => state.BoxPageReducer);
  const dispatch = useAppDispatch();

  const [boxName, setBoxName] = useState('');
  const [boxBalance, setBoxBalance] = useState(0);
  const [waiting, setWaiting] = useState(true);

  const addHandler = () => dispatch(showCreateTransactionForm());

  useEffect(() => {
    if (loading) {
      setWaiting(true);
    } else {
      if (showingMainBox && mainBox) {
        setBoxName(mainBox.name);
        setBoxBalance(mainBox.balance);
        setWaiting(false);
      } else if (boxSelected && boxSelected.balance) {
        setBoxName(boxSelected.name);
        setBoxBalance(boxSelected.balance);
        setWaiting(false);
      } else {
        setBoxName('');
        setBoxBalance(0);
        setWaiting(true);
      }
    }
  }, [showingMainBox, boxSelected, loading]);

  return (
    <>
      {waiting && <WaitingBox loading={loading} />}
      {!waiting && (
        <div>
          <header className="rounded-t-md bg-header px-6 py-2">
            <h2 className="text-center text-xl font-bold tracking-wider">{boxName}</h2>
            <p className="text-center font-bold">{currencyFormat(boxBalance)}</p>
          </header>
          <ScrollArea className="relative h-[28rem] overflow-y-auto border border-y-0 border-x-header" offsetScrollbars>
            <TransactionTable transactions={transactions} />
          </ScrollArea>
          <footer className="flex justify-end rounded-b-md bg-header px-6 py-2">
            <Button leftIcon={<IconWriting />} onClick={addHandler}>
              Agregar Transacción
            </Button>
          </footer>
        </div>
      )}

      <CreateTransactionForm />
    </>
  );
};

export default BoxShow;
