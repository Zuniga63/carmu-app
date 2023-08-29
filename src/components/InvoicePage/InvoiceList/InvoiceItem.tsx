import { IInvoiceItemBase } from '@/types';
import { currencyFormat } from '@/utils';

export default function InvoiceItem({ item }: { item: IInvoiceItemBase }) {
  const { quantity, description } = item;
  const balance = currencyFormat(item.balance);
  const amount = currencyFormat(item.amount);
  const hasBalance = item.balance && item.balance > 0;
  const unit = quantity > 1 ? 'unds' : 'und';

  return (
    <li className="text-xs text-dark dark:text-light">
      <div className="inline-block">
        <div className="flex gap-x-2">
          <span>{description}</span>
          <span>
            ( {quantity} {unit} )
          </span>
          {hasBalance && (
            <>
              <span className="italic">{balance}</span>
              <span>/</span>
            </>
          )}
          <span>{amount}</span>
        </div>
      </div>
    </li>
  );
}
