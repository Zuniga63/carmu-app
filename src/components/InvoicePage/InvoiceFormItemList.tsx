import React from 'react';
import { IInvoiceSummary, INewInvoiceItem } from 'src/types';
import InvoiceFormItemListItem from './InvoiceFormItemListItem';
import InvoiceFormSummary from './InvoiceFormSummary';

interface Props {
  items: INewInvoiceItem[];
  removeItem(itemId: string): void;
  summary?: IInvoiceSummary;
}

const InvoiceFormItemList = ({ items, removeItem, summary }: Props) => {
  return (
    <div className="relative grid grid-cols-1 items-start gap-4 lg:grid-cols-4">
      <div
        className={`mb-2 min-h-[10rem] bg-gray-300 dark:bg-dark ${
          summary ? 'lg:col-span-3' : 'lg:col-span-4'
        }`}
      >
        <table className="w-full table-auto">
          <thead className="bg-gray-400 text-gray-dark dark:bg-gray-dark">
            <tr className="whitespace-nowrap  dark:text-gray-100">
              <th
                scope="col"
                className="px-2 py-1 text-center text-xs uppercase tracking-wide"
              >
                Cant.
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-center text-xs uppercase tracking-wide"
              >
                Descripción
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-center text-xs uppercase tracking-wide"
              >
                Vlr. Unt
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-center text-xs uppercase tracking-wide"
              >
                Importe
              </th>
              <th
                scope="col"
                className="relative px-2 py-1 text-center text-xs uppercase tracking-wide"
              >
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {items.map(item => (
              <InvoiceFormItemListItem
                key={item.id}
                item={item}
                onRemove={removeItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      {summary ? (
        <div className="block lg:sticky lg:top-0">
          <InvoiceFormSummary summary={summary} />
        </div>
      ) : null}
    </div>
  );
};

export default InvoiceFormItemList;
