import { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import { currencyFormat } from '@/utils';

type Props = {
  size: InvoicePrintSize;
  subtotal?: number;
  discount?: number;
  totalAmount?: number;
};

export default function InvoiceResume({ size, subtotal = 0, discount, totalAmount = 0 }: Props) {
  return (
    <div className="flex justify-end gap-x-4">
      <div className="flex flex-col items-end">
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Subtotal:</p>
        {discount && <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Descuento:</p>}
        <p className={size === 'sm' ? 'text-base font-bold' : 'text-lg font-bold'}>Total:</p>
      </div>
      <div className="flex flex-col items-end">
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(subtotal)}</p>
        {discount && <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(discount)}</p>}
        <p className={size === 'sm' ? 'text-base font-bold' : 'text-lg font-bold'}>{currencyFormat(totalAmount)}</p>
      </div>
    </div>
  );
}
