import { IconTrash } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { INewInvoiceItem } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  item: INewInvoiceItem;
  onRemove(itemId: string): void;
}

const InvoiceFormItemListItem = ({ item, onRemove }: Props) => {
  const { categories } = useAppSelector(state => state.InvoicePageReducer);
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
    <tr className="bg-gray-200 text-dark odd:bg-dark odd:text-light">
      <td className="whitespace-nowrap px-2 py-1 text-center text-sm">{item.quantity}</td>
      <td className="px-2 py-1 text-sm">
        <p>{item.description}</p>
        {itemCategories ? <p className="text-xs font-bold text-light text-opacity-60">{itemCategories}</p> : null}
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
