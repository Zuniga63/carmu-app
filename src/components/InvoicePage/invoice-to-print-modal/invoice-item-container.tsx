import { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import { cn } from '@/utils';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  size: InvoicePrintSize;
  className?: string;
};

export default function InvoiceItemContainer({ children, size, className }: Props) {
  return (
    <div
      className={cn('mb-2 border-b-4 border-double border-dark pb-2', className, {
        'col-span-2 m-0 border-none p-0': size === 'lg',
      })}
    >
      {children}
    </div>
  );
}
