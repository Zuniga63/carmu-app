import { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import { useConfigStore } from '@/store/config-store';
import { IInvoiceFull } from '@/types';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

type Props = {
  size: InvoicePrintSize;
  invoice?: IInvoiceFull;
};

export default function InvoiceFooter({ size, invoice }: Props) {
  const premiseStore = useConfigStore(state => state.premiseStore);
  const { christmasTicket, sellerName } = invoice || {};

  return (
    <div className={cn('mt-5 grid gap-y-5', { 'grid-cols-2 gap-x-4': size === 'lg' })}>
      <div className={cn({ 'col-span-2': size === 'lg' && !christmasTicket })}>
        <p className={cn('text-center text-sm')}>
          Vendedor: <span className="font-bold">{sellerName}</span>
        </p>
        <p className="text-center text-xs font-bold">{premiseStore ? premiseStore.name : 'Tienda Carmú'}</p>
      </div>

      {christmasTicket && (
        <div className="mx-1 h-[3cm] w-full max-w-[9cm] rounded border-4 py-2 font-display">
          <div className="mx-auto flex h-full w-11/12 flex-col text-xs">
            <div className="flex justify-between gap-x-2">
              <p className="text-xs">
                Ticket # <span className="font-bold">{christmasTicket}</span>
              </p>
              <p>
                Factura: #<span className="font-bold">{invoice?.prefixNumber}</span>{' '}
              </p>
            </div>

            <div className="flex flex-grow flex-col justify-center">
              <p className="line-clamp-2 text-center text-sm font-bold">{invoice?.customer?.fullName}</p>

              {invoice?.customer?.documentNumber && (
                <p className="line-clamp-1 text-center font-bold">
                  C.C: <span className="font-bold tracking-widest">{invoice?.customer?.documentNumber}</span>
                </p>
              )}

              {invoice?.customerPhone && (
                <p className="text-center text-neutral-600">
                  Tel: <span className="tracking-widest">{invoice?.customerPhone}</span>{' '}
                </p>
              )}
            </div>

            <p className="text-right italic">Fecha: {dayjs(invoice?.expeditionDate).format('DD-MM-YY hh:mm a')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
