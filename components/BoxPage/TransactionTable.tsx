import React from 'react';
import { ITransaction } from 'types';
import TransactionTableItem from './TransactionTableItem';

interface Props {
  transactions: ITransaction[];
}
const TransactionTable = ({ transactions }: Props) => {
  return (
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
          <TransactionTableItem key={item.id} transaction={item} />
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
