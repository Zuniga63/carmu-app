import type { IInvoice } from '@/types';

import InvoiceListLoader from './InvoiceListLoader';
import { Button, ScrollArea } from '@mantine/core';
import InvoiceCard from './InvoiceCard';

type Props = {
  invoices: IInvoice[];
  isLoading: boolean;
  showMoreButtonInvoice: boolean;
  onShowMore: () => void;
};

export default function InvoiceListBody({ invoices, showMoreButtonInvoice, isLoading, onShowMore }: Props) {
  return (
    <div className="relative flex-grow">
      <div className="absolute inset-0 bg-gray-300 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 p-2 dark:bg-gradient-to-b dark:from-red-500 dark:via-orange-500 dark:to-yellow-500">
        {isLoading ? (
          <InvoiceListLoader />
        ) : (
          <ScrollArea className="h-full rounded bg-white bg-opacity-20 p-4 backdrop-blur dark:bg-dark dark:bg-opacity-40">
            <div className="flex flex-col gap-y-4">
              {invoices.map(invoice => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}

              {showMoreButtonInvoice && <Button onClick={onShowMore}>Mostrar más facturas</Button>}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
