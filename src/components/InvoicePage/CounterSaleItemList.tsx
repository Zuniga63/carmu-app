import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';
import { getItemCategory } from '@/logic/invoices-form';
import type { INewInvoiceItem } from '@/types';
import { currencyFormat } from '@/utils';
import { Table } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useMemo } from 'react';

type Props = {
  items?: INewInvoiceItem[];
  onRemoveItem?: (itemId: string) => void;
};

function ItemListHeader() {
  return (
    <thead>
      <tr className="whitespace-nowrap">
        <th scope="col">
          <span className="block text-center uppercase tracking-wide">Cant.</span>
        </th>
        <th scope="col" className="uppercase tracking-wide">
          Descripción
        </th>
        <th scope="col" className="uppercase tracking-wide">
          Vlr. Unt
        </th>
        <th scope="col" className="uppercase tracking-wide">
          Importe
        </th>
        <th scope="col" className="relative uppercase tracking-wide">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
}

export default function CounterSaleItemList({ items = [], onRemoveItem }: Props) {
  const { data: categories = [] } = useGetAllCategories();

  const amount = useMemo(() => {
    return items.reduce((sum, { amount }) => sum + amount, 0);
  }, [items]);

  const handleRemoveItem = (itemId: string) => {
    if (!onRemoveItem) return;
    onRemoveItem(itemId);
  };

  return (
    <div className="min-h-[150px]">
      <Table horizontalSpacing="sm" striped highlightOnHover fontSize="sm">
        <ItemListHeader />
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="whitespace-nowrap px-2 py-1 text-center text-sm">{item.quantity}</td>
              <td>
                <span className="block">{item.description}</span>
                <span className="block text-xs text-dark text-opacity-80 dark:text-light dark:text-opacity-80">
                  {getItemCategory(item, categories)}
                </span>
              </td>
              <td>
                <div className="flex flex-col text-right text-sm">
                  <span className={`${Boolean(item.discount) && 'scale-90 text-xs line-through opacity-70'}`}>
                    {currencyFormat(item.unitValue)}
                  </span>
                  {Boolean(item.discount) && <span>{currencyFormat(item.unitValue - (item.discount || 0))}</span>}
                </div>
              </td>
              <td className="whitespace-nowrap px-2 py-1 text-right">{currencyFormat(item.amount)}</td>
              <td>
                <div className="flex w-full items-center justify-center">
                  <button
                    className="rounded-full border border-transparent p-1 text-red-500 transition-colors hover:border-red-500 hover:bg-red-100 hover:text-opacity-70 hover:shadow-md active:text-opacity-90"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {amount > 0 ? (
        <div className="mt-4 flex justify-end">
          <p className="text-lg">
            Total: <span className="font-bold">{currencyFormat(amount)}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
