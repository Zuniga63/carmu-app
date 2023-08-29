import { Collapse } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { IInvoiceBaseFull } from '@/types';
import { currencyFormat } from '@/utils';

interface Props {
  invoice: IInvoiceBaseFull;
}
const CustomerInfoInvoiceCard = ({ invoice }: Props) => {
  const isCredit = !invoice.isSeparate && invoice.balance;
  const isCancel = Boolean(invoice.cancel);
  const hasBalance = Boolean(invoice.balance);
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <header
        className={
          isCancel
            ? 'cursor-pointer rounded-t-lg border border-gray-500 bg-gray-500 bg-opacity-10'
            : hasBalance
            ? isCredit
              ? 'cursor-pointer rounded-t-lg border border-red-500 bg-red-500 bg-opacity-10' //Credit Style
              : 'cursor-pointer rounded-t-lg border border-blue-500 bg-blue-500 bg-opacity-10' //Separate Style
            : 'cursor-pointer rounded-t-lg border border-green-500 bg-green-500 bg-opacity-10'
        }
        onClick={() => setOpened(current => !current)}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div>
            <p className="text-xs">{dayjs(invoice.expeditionDate).format('DD/MM/YY hh:mm a')}</p>
            <p className="text-xs">{dayjs(invoice.expeditionDate).fromNow()}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex gap-x-1 text-sm">
              <span>N°</span> <span>{invoice.prefixNumber}</span>
            </div>
            <p className="flex gap-x-2 text-xs">
              {Boolean(invoice.balance) && (
                <>
                  <span>{currencyFormat(invoice.balance)}</span>
                  <span>/</span>
                </>
              )}
              <span>{currencyFormat(invoice.amount)}</span>
            </p>
          </div>
        </div>
      </header>
      <Collapse in={opened}>
        <ul className="list-inside list-disc rounded-b bg-dark p-2">
          {invoice.items.map(item => (
            <li key={item.id} className="text-xs text-light">
              <div className="inline-block">
                <div className="flex gap-x-2">
                  <span>{item.description}</span>
                  <span>( {item.quantity} und )</span>
                  {Boolean(item.balance) && (
                    <>
                      <span className="italic">{currencyFormat(item.balance)}</span>
                      <span>/</span>
                    </>
                  )}
                  <span>{currencyFormat(item.amount)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  );
};

export default CustomerInfoInvoiceCard;
