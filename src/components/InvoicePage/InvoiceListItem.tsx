import { Button, Collapse, Tabs } from '@mantine/core';
import {
  IconCircleSquare,
  IconFileInvoice,
  IconListCheck,
} from '@tabler/icons';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useAppDispatch } from 'src/store/hooks';
import { IInvoice } from 'src/types';
import { currencyFormat } from 'src/utils';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { mountInvoice } from 'src/features/InvoicePage';

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

  const isToday = invoice.expeditionDate.isToday();

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
        isToday
          ? invoice.balance
            ? invoice.isSeparate
              ? 'border-blue-700 bg-blue-900 shadow-blue-800 hover:bg-blue-600 hover:shadow-blue-500'
              : 'border-red-700 bg-red-900 shadow-red-800 hover:bg-red-600 hover:shadow-red-500'
            : 'border-emerald-700 bg-emerald-900 shadow-emerald-800 hover:bg-emerald-600 hover:shadow-emerald-700'
          : 'border-header bg-header shadow-header hover:border-dark hover:bg-dark hover:shadow-neutral-900'
      } shadow  transition-colors ${invoice.cancel ? 'opacity-50' : ''} `}
    >
      <header
        className="px-4 py-2 hover:cursor-pointer"
        onClick={() => setOpened(current => !current)}
      >
        {invoice.premiseStore ? (
          <p className="text-center text-xs font-bold italic">
            {invoice.premiseStore.name}
          </p>
        ) : null}
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
        <div className="flex justify-between">
          <p
            className={` text-xs italic ${
              isToday ? 'tetx-gray-200' : 'text-gray-400'
            }`}
          >
            {invoice.customer
              ? invoice.customer.fullName
              : invoice.customerName}
          </p>

          <p
            className={` text-xs italic ${
              isToday ? 'tetx-gray-200' : 'text-gray-400'
            }`}
          >
            {currencyFormat(invoice.amount)}
          </p>
        </div>
      </header>
      <Collapse in={opened}>
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
            <ul className="list-inside list-disc p-2">
              {invoice.items.map(item => (
                <li key={item.id} className="text-xs">
                  <div className="inline-block">
                    <div className="flex gap-x-2">
                      <span>{item.description}</span>
                      <span>( {item.quantity} und )</span>
                      {Boolean(item.balance) && (
                        <>
                          <span className="italic">
                            {currencyFormat(item.balance)}
                          </span>
                          <span>/</span>
                        </>
                      )}
                      <span>{currencyFormat(item.amount)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Tabs.Panel>
          <Tabs.Panel value="resume" pt="xs">
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
                  <p className="text-xs">
                    {' '}
                    - {currencyFormat(summary.discount)}
                  </p>
                  <p className="border-t text-base font-bold">
                    {currencyFormat(summary.amount)}
                  </p>
                  <p className="text-xs"> - {currencyFormat(summary.cash)}</p>
                  <p className="text-xs">
                    {' '}
                    - {currencyFormat(summary.payments)}
                  </p>
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
          </Tabs.Panel>
        </Tabs>

        <footer className="flex justify-end px-4 py-3">
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
