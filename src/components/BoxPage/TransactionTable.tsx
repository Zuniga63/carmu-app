import { Table } from '@mantine/core';
import React from 'react';
import { ITransaction } from 'src/types';
import TransactionTableItem from './TransactionTableItem';

interface Props {
  transactions: ITransaction[];
}
const TransactionTable = ({ transactions }: Props) => {
  return (
    <Table
      className="relative"
      verticalSpacing="sm"
      striped
      highlightOnHover
      width="100%"
    >
      <thead className="sticky top-0 z-fixed bg-gray-200 dark:bg-dark">
        <tr className="text-dark dark:text-gray-300">
          <th scope="col">
            <div className="text-center text-xs uppercase tracking-wide lg:text-base">
              Fecha
            </div>
          </th>
          <th scope="col">
            <div className="text-center text-xs uppercase tracking-wide lg:text-base">
              Descripción
            </div>
          </th>
          <th
            scope="col"
            className="text-center text-xs uppercase tracking-wide lg:text-base"
          >
            Importe
          </th>
          <th scope="col" className="hidden lg:table-cell">
            <div className="text-center uppercase tracking-wide">Saldo</div>
          </th>
          <th scope="col" className="relative">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(item => (
          <TransactionTableItem key={item.id} transaction={item} />
        ))}
      </tbody>
    </Table>
  );
};

export default TransactionTable;
