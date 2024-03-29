import { IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { INewInvoiceItem } from '@/types';
import { currencyFormat } from '@/lib/utils';
import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';

interface Props {
  item: INewInvoiceItem;
  onRemove(itemId: string): void;
}

const InvoiceFormItemListItem = ({ item, onRemove }: Props) => {
  const { data: categories = [] } = useGetAllCategories();
  const [itemCategories, setItemCategories] = useState('');

  useEffect(() => {
    item.categories.forEach(categoryId => {
      let result = '';
      const categoryName = categories.find(category => category.id === categoryId)?.name;
      if (categoryName) result += `${categoryName} `;

      setItemCategories(result.trim());
    });
  }, []);
  return (
    <tr className="group transition-colors hover:bg-neutral-200 dark:text-light dark:hover:text-dark">
      <td className="whitespace-nowrap px-2 py-1 text-center text-sm">{item.quantity}</td>
      <td className="px-2 py-1 text-sm">
        <p>{item.description}</p>
        {itemCategories ? (
          <p className="text-xs text-gray-dark transition-colors group-hover:font-bold group-hover:text-dark dark:text-light dark:group-hover:text-dark">
            {itemCategories}
          </p>
        ) : null}
      </td>
      <td className="whitespace-nowrap px-2 py-1 text-center text-xs">
        <div className="flex flex-col text-sm">
          <span className={`${Boolean(item.discount) && 'scale-90 text-xs line-through opacity-70'}`}>
            {currencyFormat(item.unitValue)}
          </span>
          {Boolean(item.discount) && <span>{currencyFormat(item.unitValue - (item.discount || 0))}</span>}
        </div>
      </td>
      <td className="whitespace-nowrap px-2 py-1 text-right">{currencyFormat(item.amount)}</td>
      <td className="px-3">
        <div className="flex items-center justify-center">
          <button
            className="rounded-full border border-transparent p-1 text-red-500 transition-colors hover:border-red-500 hover:bg-red-100 hover:text-opacity-70 hover:shadow-md active:text-opacity-90"
            onClick={() => onRemove(item.id)}
          >
            <IconTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InvoiceFormItemListItem;
