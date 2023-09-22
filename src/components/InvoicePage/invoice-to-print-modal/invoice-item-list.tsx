import { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import type { IInvoiceItemBase } from '@/types';
import { currencyFormat } from '@/utils';

type Props = {
  size: InvoicePrintSize;
  items?: IInvoiceItemBase[];
};

export default function InvoiceItemList({ size, items = [] }: Props) {
  return (
    <div className="mb-2 border-b border-dashed pb-2">
      <div className="mb-2 flex justify-between font-bold">
        <h3 className={size === 'sm' ? 'text-xs uppercase ' : 'text-sm uppercase'}>Cant.</h3>
        <h3 className={size === 'sm' ? 'justify-self-start text-xs uppercase' : 'justify-self-start text-sm uppercase'}>
          Descripción
        </h3>
        <h3 className={size === 'sm' ? 'text-xs uppercase ' : 'text-sm uppercase'}>Vlr. Unt</h3>
      </div>
      {items.map(item => (
        <div
          key={item.id}
          className={
            size === 'sm'
              ? 'mb-1 flex items-center justify-between gap-x-2 text-xs'
              : 'mb-1 flex items-center justify-between gap-x-2 text-sm'
          }
        >
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
