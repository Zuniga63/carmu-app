import { Tabs } from '@mantine/core';
import { IconCircleSquare, IconListCheck } from '@tabler/icons';
import { IInvoice } from 'src/types';
import InvoiceItem from './InvoiceItem';
import InvoiceSumary from './InvoiceSumary';

type Props = {
  invoice: IInvoice;
};

export default function InvoiceCardBody({ invoice }: Props) {
  const { items } = invoice;

  return (
    <div className="bg-light bg-opacity-80 px-4 pt-1 dark:bg-header dark:bg-opacity-60">
      <Tabs defaultValue="items">
        <Tabs.List>
          <Tabs.Tab value="items" icon={<IconListCheck size={14} />}>
            Items
          </Tabs.Tab>
          <Tabs.Tab value="resume" icon={<IconCircleSquare size={14} />}>
            Resumen
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="items" pt="xs">
          {items ? (
            <ul className="list-inside list-disc p-2">
              {items.map(item => (
                <InvoiceItem key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <p>Las facturas de mas de una semana no cargan los items.</p>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="resume" pt="xs">
          <InvoiceSumary
            subtotal={invoice.subtotal}
            discount={invoice.discount}
            amount={invoice.amount}
            cash={invoice.cash}
            cashChange={invoice.cashChange}
            balance={invoice.balance}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
