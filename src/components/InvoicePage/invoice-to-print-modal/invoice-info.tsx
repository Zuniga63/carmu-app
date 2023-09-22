import type { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import type { IInvoiceBase } from '@/types';
import dayjs from 'dayjs';

type Props = {
  size: InvoicePrintSize;
  invoice?: IInvoiceBase;
};

export default function InvoiceInfo({ size, invoice }: Props) {
  const formatDate = (date?: string) => {
    const format = size === 'lg' ? 'DD-MM-YYYY hh:mm a' : 'DD-MM-YYYY';
    return dayjs(date).format(format);
  };

  const formatTime = (date?: string) => {
    const format = 'hh:mm a';
    return dayjs(date).format(format);
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
      <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
        <p>Fecha:</p>
        <p className="font-bold">{formatDate(invoice?.expeditionDate)}</p>
      </div>

      {size !== 'lg' && (
        <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
          <p>Hora:</p>
          <p className="font-bold">{formatTime(invoice?.expeditionDate)}</p>
        </div>
      )}
      {/* Customer */}
      <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
        <p>Cliente:</p>
        <p className="line-clamp-1 font-bold">
          {invoice?.customer ? invoice.customer.fullName : invoice?.customerName}
        </p>
      </div>
      {/* DOCUMENT */}
      {invoice?.customerDocument && (
        <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
          <p>{invoice.customerDocumentType}:</p>
          <p className="line-clamp-1 font-bold">{invoice.customerDocument}</p>
        </div>
      )}
      {/* ADDRESS */}
      {invoice?.customerAddress && (
        <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
          <p>Dirección:</p>
          <p className="line-clamp-1 font-bold">{invoice.customerAddress}</p>
        </div>
      )}
    </div>
  );
}
