import type { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import { ActionIcon } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';

type Props = {
  className?: string;
  size: InvoicePrintSize;
  onClick: (size: InvoicePrintSize) => void;
};

export default function PrintButtons({ className, size, onClick }: Props) {
  return (
    <div className={`flex flex-col items-center gap-y-4 ${className}`}>
      <ActionIcon
        size="sm"
        color="green"
        variant={size === 'sm' ? 'filled' : 'subtle'}
        onClick={() => {
          onClick('sm');
        }}
      >
        <IconPrinter size={18} stroke={2} />
      </ActionIcon>

      <ActionIcon
        size="lg"
        color="green"
        variant={size === 'md' ? 'filled' : 'subtle'}
        onClick={() => {
          onClick('md');
        }}
      >
        <IconPrinter size={24} stroke={2} />
      </ActionIcon>

      <ActionIcon
        size="xl"
        color="green"
        variant={size === 'lg' ? 'filled' : 'subtle'}
        onClick={() => {
          onClick('lg');
        }}
      >
        <IconPrinter size={30} stroke={2} />
      </ActionIcon>
    </div>
  );
}
