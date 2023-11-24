import { useMemo } from 'react';
import { useGetAllInvoices } from '@/hooks/react-query/invoices.hooks';

import { Tooltip } from '@mantine/core';
import { IconCircleCheck, IconAlertCircle, IconClock, IconX } from '@tabler/icons-react';

export default function InvoiceRated() {
  const { data: invoices = [] } = useGetAllInvoices();

  const [paid, pending, separated, canceled] = useMemo(() => {
    let paid = 0,
      pending = 0,
      separated = 0,
      canceled = 0;

    invoices.forEach(invoice => {
      if (invoice.cancel) canceled += 1;
      else if (!invoice.balance) paid += 1;
      else if (invoice.isSeparate) separated += 1;
      else pending += 1;
    });
    return [paid, pending, separated, canceled];
  }, [invoices]);

  return (
    <footer className="flex flex-wrap justify-evenly gap-2 rounded-b-md bg-dark px-4 py-3 dark:bg-header">
      <Tooltip label="Pagadas" withArrow color="green">
        <div className="flex items-center gap-x-2 text-sm text-green-600 hover:cursor-help dark:text-green-400">
          <IconCircleCheck size={20} stroke={2} /> <span className="font-bold">{paid}</span>
        </div>
      </Tooltip>
      <Tooltip label="Pendientes" withArrow color="orange">
        <div className="flex items-center gap-x-2 text-sm text-orange-500 hover:cursor-help dark:text-orange-400">
          <IconAlertCircle size={20} stroke={2} /> <span className="font-bold">{pending}</span>
        </div>
      </Tooltip>
      <Tooltip label="Apartados" withArrow color="blue">
        <div className="flex items-center gap-x-2 text-sm text-blue-500 hover:cursor-help dark:text-blue-400">
          <IconClock size={20} stroke={2} /> <span className="font-bold">{separated}</span>
        </div>
      </Tooltip>
      <Tooltip label="Canceladas" withArrow color="blue">
        <div className="flex items-center gap-x-2 text-sm text-red-500 hover:cursor-help dark:text-red-400">
          <IconX size={20} stroke={2} /> <span className="font-bold">{canceled}</span>
        </div>
      </Tooltip>
    </footer>
  );
}
