import { Tabs } from '@mantine/core';
import { IconBox, IconFileInvoice } from '@tabler/icons';
import React from 'react';
import { IInvoiceFull } from 'types';
import InvoiceCardField from './InvoiceCardField';
import InvoiceCardItems from './InvoiceCardItems';
import InvoiceCardPayments from './InvoiceCardPayments';
import InvoiceCardSummary from './InvoiceCardSummary';

interface Props {
  invoice: IInvoiceFull;
}

const InvoiceCard = ({ invoice }: Props) => {
  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {/* CUSTOMER */}
        <div className="col-span-2">
          <div className="rounded-lg bg-gray-dark bg-opacity-20 px-4 py-6">
            <div className="grid grid-cols-12 gap-4">
              {/* CUSTOMER NAME */}
              <div className="col-span-8">
                <InvoiceCardField title="Cliente">
                  <p className="italic">{invoice?.customer?.fullName || invoice?.customerName}</p>
                </InvoiceCardField>
              </div>
              {/* DOCUMENT */}
              <div className="col-span-4">
                <InvoiceCardField title="Documento">
                  <p className="text-center italic">
                    <span>{invoice?.customerDocumentType}</span>
                    {': '}
                    <span className="font-bold">
                      {invoice?.customer?.documentNumber || invoice?.customerDocument || 'No reporta'}
                    </span>
                  </p>
                </InvoiceCardField>
              </div>
              {/* CUSTOMER ADDRESS */}
              <div className="col-span-8">
                <InvoiceCardField title="Dirección">
                  <p className="italic">{invoice.customer?.address || invoice?.customerAddress || 'No reporta'}</p>
                </InvoiceCardField>
              </div>
              {/* DOCUMENT */}
              <div className="col-span-4">
                <InvoiceCardField title="Teléfono">
                  <p className="text-center italic">
                    <span className="font-bold">{invoice?.customerPhone || 'No reporta'}</span>
                  </p>
                </InvoiceCardField>
              </div>
            </div>
          </div>
        </div>
        {/* DATES */}
        <div className="rounded-lg bg-gray-dark bg-opacity-20 px-4 py-6">
          <div className="mb-4">
            <InvoiceCardField title="Expedición">
              <p className="italic">{invoice?.expeditionDate.format('DD-MM-YYYY')}</p>
            </InvoiceCardField>
          </div>
          <div>
            <InvoiceCardField title="Vencimiento">
              <p className="italic">{invoice?.expirationDate.format('DD-MM-YYYY')}</p>
            </InvoiceCardField>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-black bg-opacity-30 px-2 py-4 shadow shadow-dark">
        <div className="relative grid grid-cols-4 gap-x-4">
          {/* ITEMS AND PAYMENTS */}
          <div className="col-span-3">
            <Tabs defaultValue="items" color="blue">
              <Tabs.List>
                <Tabs.Tab value="items" color="blue" icon={<IconBox size={14} />}>
                  Articulos
                </Tabs.Tab>
                <Tabs.Tab value="payments" icon={<IconFileInvoice size={14} />}>
                  Pagos
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="items">
                <div>
                  <InvoiceCardItems items={invoice.items} />
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="payments">
                <div>
                  <InvoiceCardPayments payments={invoice.payments} />
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>
          {/* SUMMARY */}
          {invoice && <InvoiceCardSummary invoice={invoice} />}
        </div>
      </div>
    </>
  );
};

export default InvoiceCard;
