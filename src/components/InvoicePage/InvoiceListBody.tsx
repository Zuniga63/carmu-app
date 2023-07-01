import { ReactNode } from 'react';
import { invoicePageSelector } from 'src/features/InvoicePage';
import { useAppSelector } from 'src/store/hooks';
import InvoiceListLoader from './InvoiceListLoader';
import { ScrollArea } from '@mantine/core';

type Props = {
  children?: ReactNode;
};

export default function InvoiceListBody({ children }: Props) {
  const { loading } = useAppSelector(invoicePageSelector);

  return (
    <div className="relative flex-grow">
      <div className="absolute inset-0 bg-gray-300 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 p-2 dark:bg-gradient-to-b dark:from-red-500 dark:via-orange-500 dark:to-yellow-500">
        {loading ? (
          <InvoiceListLoader />
        ) : (
          <ScrollArea className="h-full rounded bg-white bg-opacity-20 p-4 backdrop-blur dark:bg-dark dark:bg-opacity-40">
            <div className="flex flex-col gap-y-4">{children}</div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
