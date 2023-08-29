import { Table } from '@mantine/core';
import React from 'react';
import { IInvoiceItemBase } from '@/types';
import InvoiceCardItemsRow from './InvoiceCardItemsRow';

interface Props {
  items: IInvoiceItemBase[];
}

const InvoiceCardItems = ({ items }: Props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th scope="col" className="whitespace-nowrap">
            <div className="text-center text-xs">Cant.</div>
          </th>
          <th scope="col">Descripción</th>
          <th scope="col">
            <div className="text-center">Vlr. Unt</div>
          </th>
          <th scope="col">
            <div className="text-center">Importe</div>
          </th>
          <th scope="col">
            <div className="text-center">Saldo</div>
          </th>
          <th scope="col">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <InvoiceCardItemsRow item={item} key={item.id} />
        ))}
      </tbody>
    </Table>
  );
};

export default InvoiceCardItems;
