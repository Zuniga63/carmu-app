import type { IInvoiceItemBase } from '@/types';
import { currencyFormat } from '@/utils';

type Props = {
  items?: IInvoiceItemBase[];
};

export default function InvoiceItemList({ items = [] }: Props) {
  return (
    <div className="mb-2 border-b border-dashed pb-2">
      <div className="mb-2 flex justify-between font-bold">
        <h3 className="text-xs uppercase ">Cant.</h3>
        <h3 className="justify-self-start text-xs uppercase">Descripción</h3>
        <h3 className="text-xs uppercase ">Vlr. Unt</h3>
      </div>
      {items.map(item => (
        <div key={item.id} className="mb-1 flex items-center justify-between gap-x-2 text-xs">
          <p className="flex-shrink-0 px-2">{item.quantity}</p>
          <p className="flex-grow uppercase">{item.description}</p>
          <div className="flex flex-shrink-0 flex-col items-end justify-center">
            {item.discount && <p className="text-xs text-gray-700 line-through">{currencyFormat(item.unitValue)}</p>}
            <p className="flex-shrink-0 tracking-widest">{currencyFormat(item.unitValue - (item.discount || 0))}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
