import React from 'react';
import { ScrollArea } from '@mantine/core';
import { INewInvoiceItem } from 'types';
import InvoiceFormItemListItem from './InvoiceFormItemListItem';

interface Props {
  items: INewInvoiceItem[];
  removeItem(itemId: string): void;
}

const InvoiceFormItemList = ({ items, removeItem }: Props) => {
  return (
    <ScrollArea className="relative h-40 overflow-y-auto bg-gradient-to-br from-dark via-neutral-500 to-header">
      <table className="w-full table-auto">
        <thead className="sticky top-0 z-fixed bg-gray-dark">
          <tr className="whitespace-nowrap text-gray-100">
            <th scope="col" className="px-2 py-1 text-center text-xs uppercase tracking-wide">
              Cant.
            </th>
            <th scope="col" className="px-2 py-1 text-center text-xs uppercase tracking-wide">
              Descripción
            </th>
            <th scope="col" className="px-2 py-1 text-center text-xs uppercase tracking-wide">
              Vlr. Unt
            </th>
            <th scope="col" className="px-2 py-1 text-center text-xs uppercase tracking-wide">
              Importe
            </th>
            <th scope="col" className="relative px-2 py-1 text-center text-xs uppercase tracking-wide">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map(item => (
            <InvoiceFormItemListItem key={item.id} item={item} onRemove={removeItem} />
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
};

export default InvoiceFormItemList;
