import React from 'react';
import { ScrollArea } from '@mantine/core';
import { IInvoiceSummary, INewInvoiceItem } from 'types';
import InvoiceFormItemListItem from './InvoiceFormItemListItem';
import { currencyFormat } from 'utils';

interface Props {
  items: INewInvoiceItem[];
  removeItem(itemId: string): void;
  summary: IInvoiceSummary;
}

const InvoiceFormItemList = ({ items, removeItem, summary }: Props) => {
  return (
    <div>
      <ScrollArea className="relative mb-2 h-40 overflow-y-auto bg-dark">
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
      {/* SUMMARY */}
      <div className="flex gap-x-4">
        {/* PROPERTIES */}
        <div className="flex-grow">
          <div className="flex flex-col gap-y-1 text-right">
            <p>Subtotal</p>
            {summary.discount && <p className="text-sm">Descuento</p>}
            <p className="text-xl">Total</p>
          </div>
        </div>
        {/* VALUES */}
        <div className="flex-shrink-0">
          <div className="flex flex-col gap-y-1 text-right tracking-widest">
            <p>{currencyFormat(summary.subtotal)}</p>
            {summary.discount && <p className="text-sm">{currencyFormat(summary.discount)}</p>}
            <p className="text-xl font-bold">{currencyFormat(summary.amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormItemList;
