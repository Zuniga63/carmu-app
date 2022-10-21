import React from 'react';
import { IInvoiceItemBase } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  item: IInvoiceItemBase;
}

const InvoiceCardItemsRow = ({ item }: Props) => {
  return (
    <tr>
      <td className="text-center">{item.quantity}</td>
      <td>{item.description}</td>
      <td>
        <div className="text-right">
          <p className={`${item.discount && 'scale-90 text-xs line-through'}`}>{currencyFormat(item.unitValue)}</p>
          {item.discount && <p>{currencyFormat(item.unitValue - item.discount)}</p>}
        </div>
      </td>
      <td className="text-right">{currencyFormat(item.amount)}</td>
      <td></td>
    </tr>
  );
};

export default InvoiceCardItemsRow;
