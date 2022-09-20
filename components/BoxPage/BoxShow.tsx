import { Button, ScrollArea } from '@mantine/core';
import { IconWriting } from '@tabler/icons';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { showCreateTransactionForm } from 'store/reducers/BoxPage/creators';
import { currencyFormat } from 'utils';
import CreateTransactionForm from './CreateTransactionForm';
import WaitingBox from './WaitingBox';

const BoxShow = () => {
  const { boxSelected, loadingTransactions: loading, transactions } = useAppSelector(state => state.BoxPageReducer);
  const dispatch = useAppDispatch();

  const addHandler = () => dispatch(showCreateTransactionForm());

  return (
    <>
      {!boxSelected && <WaitingBox loading={loading} />}
      {boxSelected && (
        <div>
          <header className="rounded-t-md bg-header px-6 py-2">
            <h2 className="text-center text-xl font-bold tracking-wider">{boxSelected.name}</h2>
            <p className="text-center">{currencyFormat(boxSelected.balance)}</p>
          </header>
          <ScrollArea className="relative h-[28rem] overflow-y-auto border border-y-0 border-x-header">
            <table className='class="relative mb-2" min-w-full table-auto'>
              <thead className="sticky top-0 bg-dark">
                <tr className="text-gray-300">
                  <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-3 text-left uppercase tracking-wide">
                    Descripción
                  </th>
                  <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                    Importe
                  </th>
                  <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                    Saldo
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(item => (
                  <tr key={item.id} className="text-gray-300">
                    <td className="whitespace-nowrap px-3 py-2">
                      <div className="text-center">
                        <p className="text-sm">{item.transactionDate.format('DD/MM/YY hh:mm a')}</p>
                        <p className="text-xs">{item.transactionDate.fromNow()}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs">{item.description}</td>
                    <td className="px-3 py-2 text-right text-xs">{currencyFormat(item.amount)}</td>
                    <td className="px-3 py-2 text-right text-xs">{currencyFormat(item.balance)}</td>
                    <td className="px-3 py-2 text-xs"></td>
                  </tr>
                ))}
              </tbody>
            </table>
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
