import { IconTrash } from '@tabler/icons';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { destroyMainTransaction, destroyTransaction } from 'store/reducers/BoxPage/creators';
import { IMainTransaction, ITransaction } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  transaction: ITransaction;
}
const TransactionTableItem = ({ transaction }: Props) => {
  const { boxSelected, showingMainBox: isMainBox } = useAppSelector(state => state.BoxPageReducer);
  const dispatch = useAppDispatch();
  const otherBox = isMainBox && !!transaction.cashbox;

  const onDelete = () => {
    if (isMainBox) dispatch(destroyMainTransaction(transaction));
    else if (boxSelected) dispatch(destroyTransaction(boxSelected, transaction));
  };

  return (
    <tr className="text-dark dark:text-gray-300">
      <td className="whitespace-nowrap px-3 py-2">
        <div className="text-center">
          <p className="text-sm">{transaction.transactionDate.format('DD/MM/YY hh:mm a')}</p>
          <p className="text-xs">{transaction.transactionDate.fromNow()}</p>
        </div>
      </td>
      <td className="px-3 py-2 text-sm">
        <div>
          <p>{transaction.description}</p>
          {otherBox && (
            <p className="text-xs">
              pertenece a : <span className="font-bold">{(transaction as IMainTransaction).cashbox?.name}</span>
            </p>
          )}
        </div>
      </td>
      <td className="px-3 py-2 text-right text-sm">{currencyFormat(transaction.amount)}</td>
      <td className={`px-3 py-2 text-right text-sm ${otherBox && 'line-through'}`}>
        {currencyFormat(transaction.balance)}
      </td>
      <td className="py-2 pl-3 pr-5 text-sm">
        <button
          className="rounded-full border-2 border-red-600 border-opacity-50 p-2 text-red-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
          onClick={onDelete}
        >
          <IconTrash size={16} stroke={3} />
        </button>
      </td>
    </tr>
  );
};

export default TransactionTableItem;
