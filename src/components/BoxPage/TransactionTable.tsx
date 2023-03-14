import { Table } from '@mantine/core';
import React from 'react';
import { ITransaction } from 'src/types';
import TransactionTableItem from './TransactionTableItem';

interface Props {
  transactions: ITransaction[];
}
const TransactionTable = ({ transactions }: Props) => {
  return (
    <Table className="relative" verticalSpacing="sm" striped highlightOnHover>
      <thead className="sticky top-0 bg-gray-200 dark:bg-dark">
        <tr className="text-dark dark:text-gray-300">
          <th scope="col">
            <div className="text-center uppercase tracking-wide">Fecha</div>
          </th>
          <th scope="col">
            <div className="text-center uppercase tracking-wide">
              Descripción
            </div>
          </th>
          <th scope="col" className="text-center uppercase tracking-wide">
            Importe
          </th>
          <th scope="col">
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
