import type { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import type { IInvoiceFull } from '@/types';
import { type Dayjs } from 'dayjs';

type Props = {
  size: InvoicePrintSize;
  invoice?: IInvoiceFull;
};

export default function InvoiceInfo({ size, invoice }: Props) {
  const formatDate = (date?: Dayjs) => {
    const format = size === 'lg' ? 'dddd DD-MM-YYYY hh:mm a' : 'DD-MM-YYYY';
    return date ? date.format(format) : '';
  };

  const formatTime = (date?: Dayjs) => {
    const format = 'hh:mm a';
    return date ? date.format(format) : '';
  };

  return (
    <div className="mb-2 border-b-4 border-double border-dark pb-2">
      {/* INVOICE NUMBER */}
      {size !== 'lg' ? (
        <div className={`mb-2 text-center ${size === 'sm' ? 'text-base' : 'flex justify-center gap-2 text-xl'}`}>
          <h2 className="uppercase">{invoice?.isSeparate ? 'Apartado' : 'Factura de venta'}</h2>
          <p>
            N°{' '}
            <span className={size === 'sm' ? 'font-bold text-dark' : 'font-bold text-red-500'}>
              {invoice?.prefixNumber}
            </span>
          </p>
        </div>
      ) : null}

      {/* Expedition */}
      <div className="flex justify-between text-xs">
        <p>Fecha:</p>
        <p className="font-bold">{formatDate(invoice?.expeditionDate)}</p>
      </div>

      {size !== 'lg' && (
        <div className="flex justify-between text-xs">
          <p>Hora:</p>
          <p className="font-bold">{formatTime(invoice?.expeditionDate)}</p>
        </div>
      )}
      {/* Customer */}
      <div className="flex justify-between text-xs">
        <p>Cliente:</p>
        <p className="line-clamp-1 font-bold">
          {invoice?.customer ? invoice.customer.fullName : invoice?.customerName}
        </p>
      </div>
      {/* DOCUMENT */}
      {invoice?.customerDocument && (
        <div className="flex justify-between text-xs">
          <p>{invoice.customerDocumentType}:</p>
          <p className="line-clamp-1 font-bold">{invoice.customerDocument}</p>
        </div>
      )}
      {/* ADDRESS */}
      {invoice?.customerAddress && (
        <div className="flex justify-between text-xs">
          <p>Dirección:</p>
          <p className="line-clamp-1 font-bold">{invoice.customerAddress}</p>
        </div>
      )}
    </div>
  );
}
