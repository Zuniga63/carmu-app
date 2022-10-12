import { Button } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconFileInvoice, IconPrinter } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { IInvoice } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  invoice: IInvoice;
}
const InvoiceListItem = ({ invoice }: Props) => {
  const [textColor, setTextColor] = useState('green');

  useEffect(() => {
    if (invoice.isSeparate) setTextColor('blue');
    else if (invoice.balance) setTextColor('orange');
    else setTextColor('green');
  }, [invoice.balance, invoice.isSeparate]);

  return (
    <div className="overflow-hidden rounded-lg border border-header bg-header shadow shadow-header hover:bg-gradient-to-br hover:from-header hover:to-purple-500">
      <header className="px-4 py-2">
        <div className="flex justify-between">
          <h2 className="text-center text-sm font-bold tracking-wider">
            Factura N°: <span className={`text-${textColor}-400`}>{invoice.prefixNumber}</span>
          </h2>
          <span className="text-sm font-bold">{invoice.expeditionDate.format('DD-MM-YYYY')}</span>
        </div>
        <p className="text-center text-xs italic text-gray-400">
          {invoice.customer ? invoice.customer.fullName : invoice.customerName}
        </p>
      </header>
      <div className="bg-gradient-to-r from-slate-800 via-gray-500 to-slate-800 p-2">
        <div className="flex justify-evenly">
          <div>
            <h3 className="text-center text-xs text-gray-100">Valor</h3>
            <p className=" font-bold text-light">{currencyFormat(invoice.amount)}</p>
          </div>
          {invoice.balance && (
            <div>
              <h3 className={`text-center text-xs text-${textColor}-400`}>Saldo</h3>
              <p className={`text-sm font-bold text-${textColor}-400`}>{currencyFormat(invoice.balance)}</p>
            </div>
          )}
        </div>
      </div>
      <footer className="flex justify-between px-4 py-3">
        <Button
          size="xs"
          leftIcon={<IconPrinter size={16} />}
          color="green"
          component={NextLink}
          href={`/admin/invoices/print/${invoice.id}`}
          target="_blank"
        >
          Imprimir
        </Button>
        <Button size="xs" leftIcon={<IconFileInvoice size={16} />}>
          Ver
        </Button>
      </footer>
    </div>
  );
};

export default InvoiceListItem;
