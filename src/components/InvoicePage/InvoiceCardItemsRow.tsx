import React, { useEffect, useState } from 'react';
import { IInvoiceItemBase } from '@/types';
import { currencyFormat } from '@/utils';
import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';

interface Props {
  item: IInvoiceItemBase;
}

const InvoiceCardItemsRow = ({ item }: Props) => {
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
    <tr className={item.cancel ? 'line-through' : ''}>
      <td className="text-center">{item.quantity}</td>
      <td>
        <p>{item.description}</p>
        {itemCategories ? <p className="text-xs font-bold text-light text-opacity-60">{itemCategories}</p> : null}
      </td>
      <td className="whitespace-nowrap">
        <div className="text-right">
          <p className={`${item.discount && 'scale-90 text-xs line-through'}`}>{currencyFormat(item.unitValue)}</p>
          {item.discount ? <p>{currencyFormat(item.unitValue - item.discount)}</p> : null}
        </div>
      </td>
      <td className="whitespace-nowrap">
        <div className="text-right">
          <p className={`${item.discount && 'scale-90 text-xs line-through'}`}>{currencyFormat(item.amount)}</p>
          {item.discount ? <p>{currencyFormat(item.unitValue - item.discount)}</p> : null}
        </div>
      </td>
      <td className="whitespace-nowrap text-right">{item.balance ? currencyFormat(item.balance) : 'Pagado'}</td>
      <td></td>
    </tr>
  );
};

export default InvoiceCardItemsRow;
