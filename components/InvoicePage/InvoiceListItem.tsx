import { Button, Collapse } from '@mantine/core';
import { IconFileInvoice, IconPrinter } from '@tabler/icons';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { mountInvoice } from 'store/reducers/InvoicePage/creators';
import { IInvoice } from 'types';
import { currencyFormat } from 'utils';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import Link from 'next/link';

dayjs.extend(isToday);

interface Props {
  invoice: IInvoice;
}
const InvoiceListItem = ({ invoice }: Props) => {
  const [opened, setOpened] = useState(false);
  const dispatch = useAppDispatch();
  const [summary, setSumary] = useState({
    subtotal: 0,
    discount: 0,
    amount: 0,
    cash: 0,
    payments: 0,
    balance: 0,
    cashChange: 0,
  });

  useEffect(() => {
    const newSummary = { ...summary };
    newSummary.subtotal = invoice.subtotal || 0;
    newSummary.discount = invoice.discount || 0;
    newSummary.amount = invoice.amount;
    newSummary.cash = invoice.cash || 0;
    newSummary.cashChange = invoice.cashChange || 0;
    if (!invoice.cashChange) {
      newSummary.balance = invoice.balance || 0;
      newSummary.payments =
        newSummary.amount - newSummary.balance - newSummary.cash;
    }

    setSumary(newSummary);
  }, [invoice]);

  const showInvoice: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();
    dispatch(mountInvoice(invoice.id));
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border text-light ${
        invoice.expeditionDate.isToday()
          ? 'border-emerald-700 bg-emerald-900'
          : 'border-header bg-header'
      } shadow shadow-header transition-colors hover:border-dark hover:bg-dark hover:shadow-neutral-900`}
    >
      <header
        className="px-4 py-2 hover:cursor-pointer"
        onClick={() => setOpened(current => !current)}
      >
        <div className="flex justify-between">
          <span className="text-sm font-bold">
            {invoice.expeditionDate.format('DD-MM-YYYY hh:mm a')}
          </span>
          <h2 className="text-center text-sm font-bold tracking-wider">
            Factura N°:{' '}
            <span
              className={
                invoice.isSeparate
                  ? 'text-blue-400'
                  : invoice.balance
                  ? 'text-orange-400'
                  : 'text-green-400'
              }
            >
              {invoice.prefixNumber}
            </span>
          </h2>
        </div>
        <p className="text-center text-xs italic text-gray-400">
          {invoice.customer ? invoice.customer.fullName : invoice.customerName}
        </p>
      </header>
      <Collapse in={opened}>
        <div className="bg-white bg-opacity-10 p-2 transition-colors hover:bg-opacity-50 hover:text-dark ">
          <div className="flex justify-between gap-x-4">
            {/* Labels */}
            <div className="text-right">
              <p className="text-xs">Subtotal:</p>
              <p className="text-xs">Descuento:</p>
              <p className="border-t border-transparent text-base font-bold">
                Total:
              </p>
              <p className="text-xs">Pago inicial:</p>
              <p className="text-xs">Abonos:</p>
              <p className="border-t border-transparent italic">Saldo:</p>
              {summary.cashChange > 0 ? (
                <p className="text-xs">Vueltos:</p>
              ) : null}
            </div>

            {/* AMOUNTS */}
            <div className="text-right tracking-widest">
              <p className="text-xs">{currencyFormat(summary.subtotal)}</p>
              <p className="text-xs"> - {currencyFormat(summary.discount)}</p>
              <p className="border-t text-base font-bold">
                {currencyFormat(summary.amount)}
              </p>
              <p className="text-xs"> - {currencyFormat(summary.cash)}</p>
              <p className="text-xs"> - {currencyFormat(summary.payments)}</p>
              <p className="border-t italic">
                {currencyFormat(summary.balance)}
              </p>
              {summary.cashChange > 0 ? (
                <p className="text-xs italic">
                  {currencyFormat(summary.cashChange)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <footer className="flex justify-between px-4 py-3">
          <Button
            size="xs"
            leftIcon={<IconPrinter size={16} />}
            color="green"
            disabled={!invoice}
          >
            <Link href={`/admin/invoices/print/${invoice?.id}`} target="_blank">
              Imprimir
            </Link>
          </Button>

          <Button
            size="xs"
            leftIcon={<IconFileInvoice size={16} />}
            onClick={showInvoice}
          >
            Ver detalles
          </Button>
        </footer>
      </Collapse>
    </div>
  );
};

export default InvoiceListItem;
