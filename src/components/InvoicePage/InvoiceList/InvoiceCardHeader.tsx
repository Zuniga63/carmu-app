import { IInvoice } from 'src/types';
import { currencyFormat } from 'src/utils';

type Props = {
  invoice: IInvoice;
  onClick: () => void;
};

export default function InvoiceCardHeader({ invoice, onClick }: Props) {
  const { premiseStore, isSeparate, balance, expeditionDate, customer } = invoice;
  const hasBalance = balance && balance > 0;
  const isToday = expeditionDate.isToday();
  const isYesterday = expeditionDate.isYesterday();

  let dateFormat = 'DD-MM-YYYY hh:mm a';
  if (isToday) dateFormat = '[Hoy a las] hh:mm a';
  else if (isYesterday) dateFormat = '[Ayer a las] hh:mm a';

  const customerName = customer ? customer.fullName : invoice.customerName;

  return (
    <header className="px-4 py-2 hover:cursor-pointer" onClick={onClick}>
      {premiseStore && <p className="text-center text-xs font-bold italic">{premiseStore.name}</p>}
      <div className="flex justify-between">
        <span className="text-sm font-bold">{expeditionDate.format(dateFormat)}</span>
        <h2 className="text-center text-sm font-bold tracking-wider">
          Factura N°:{' '}
          <span className={isSeparate ? 'text-blue-400' : hasBalance ? 'text-orange-400' : 'text-green-400'}>
            {invoice.prefixNumber}
          </span>
        </h2>
      </div>
      <div className="flex justify-between text-xs italic text-gray-400">
        <p className={isToday ? 'text-gray-200' : ''}>{customerName}</p>

        <p className={isToday ? 'text-gray-200' : ''}>{currencyFormat(invoice.amount)}</p>
      </div>
    </header>
  );
}
