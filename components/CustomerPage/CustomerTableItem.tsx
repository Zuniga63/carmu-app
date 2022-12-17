import { Loader, Tooltip } from '@mantine/core';
import {
  IconAlertCircle,
  IconCash,
  IconCircleCheck,
  IconCircleX,
  IconDeviceMobile,
  IconEdit,
  IconListCheck,
  IconMail,
  IconMapPin,
  IconSkull,
  IconTrash,
} from '@tabler/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { ICustomer } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  customer: ICustomer;
  mount(customer: ICustomer): void;
  mountToPayment(customer: ICustomer): void;
  onDelete(customer: ICustomer): Promise<void>;
  paymentLoading: boolean;
  onGetPayments(customer: ICustomer): Promise<void>;
}

const CustomerTableItem = ({
  customer,
  mount,
  onDelete,
  mountToPayment,
  paymentLoading,
  onGetPayments,
}: Props) => {
  const [customerState, setCustomerState] = useState(
    <IconCircleCheck size={40} className="text-green-500" />
  );

  useEffect(() => {
    const size = 40;
    let Icon = IconCircleCheck;
    let className = 'text-green-500';

    if (customer.balance && customer.balance > 0) {
      const lastPayment = customer.lastPayment
        ? dayjs(customer.lastPayment)
        : null;
      const firstInvoice = dayjs(customer.firstPendingInvoice);
      const effectiveDate = lastPayment || firstInvoice;
      const now = dayjs();
      const backlog = now.diff(effectiveDate, 'days');
      const debtAge = now.diff(firstInvoice, 'month');

      if (backlog >= 28) {
        if (backlog <= 45) className = 'text-amber-500';
        else if (backlog <= 90) className = 'text-red-500';
        else className = 'text-purple-500';
      }

      if (debtAge > 3) {
        if (debtAge <= 6) Icon = IconAlertCircle;
        else if (debtAge <= 9) Icon = IconCircleX;
        else Icon = IconSkull;
      }
    }

    setCustomerState(<Icon size={size} className={className} />);
  }, [customer.balance]);
  return (
    <tr className="text-dark dark:text-gray-300">
      {/* CUSTOMER */}
      <td className="whitespace-nowrap px-3 py-2">
        <div className="flex items-center gap-x-2">
          {customerState}
          <div className="text-center">
            <p>{customer.fullName}</p>
            {Boolean(customer.documentNumber) && (
              <p className="text-sm">
                <span>{customer.documentType}</span>: {customer.documentNumber}
              </p>
            )}
            {Boolean(customer.alias) && (
              <p className="text-xs text-light text-opacity-50">
                ({customer.alias})
              </p>
            )}
          </div>
        </div>
      </td>
      {/* CONTACT */}
      <td className="hidden px-3 py-2 text-center text-sm lg:table-cell ">
        <div className="flex flex-col items-center">
          {customer.email && (
            <div className="flex items-center gap-x-2 text-xs">
              <IconMail size={18} />
              <p>{customer.email}</p>
            </div>
          )}
          {customer.address && (
            <div className="flex items-center gap-x-2 text-xs">
              <IconMapPin size={18} />
              <p>{customer.address}</p>
            </div>
          )}
          {Boolean(customer.contacts.length) && (
            <div className="flex gap-x-2">
              {customer.contacts.map(contact => (
                <div
                  className="flex items-center gap-x-2 text-xs"
                  key={contact.id}
                >
                  <IconDeviceMobile size={16} />
                  <p>{contact.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </td>
      {/* HISTORY */}
      <td className="hidden px-3 py-2 text-right text-sm lg:table-cell">
        <div className="flex flex-col items-center text-xs">
          {customer.firstPendingInvoice ? (
            <p>
              Fact. más antigua {dayjs(customer.firstPendingInvoice).fromNow()}
            </p>
          ) : null}
          {customer.lastPendingInvoice &&
          customer.lastPendingInvoice !== customer.firstPendingInvoice ? (
            <p>
              Fact. más reciente {dayjs(customer.lastPendingInvoice).fromNow()}
            </p>
          ) : null}
          {customer.lastPayment ? (
            <p>Ultimo pago {dayjs(customer.lastPayment).fromNow()}</p>
          ) : null}
          <p className="italic text-gray-dark dark:text-neutral-400">
            Registro {dayjs(customer.createdAt).fromNow()}
          </p>
        </div>
      </td>
      <td className={`px-3 py-2 text-right tracking-widest`}>
        {customer.balance ? currencyFormat(customer.balance) : ''}
      </td>
      <td className="py-2 pl-3 pr-6 text-sm">
        <div className="flex justify-end gap-x-2">
          {customer.balance ? (
            <>
              <Tooltip label="Hacer abono" withArrow>
                <button
                  className="rounded-full border-2 border-green-600 border-opacity-50 p-2 text-green-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
                  onClick={() => mountToPayment(customer)}
                >
                  <IconCash size={16} stroke={2} />
                </button>
              </Tooltip>

              <Tooltip label="Ver Abonos" withArrow>
                <button
                  className="rounded-full border-2 border-purple-600 border-opacity-50 p-2 text-purple-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
                  onClick={() => onGetPayments(customer)}
                >
                  {paymentLoading ? (
                    <Loader size={16} />
                  ) : (
                    <IconListCheck size={16} stroke={2} />
                  )}
                </button>
              </Tooltip>
            </>
          ) : null}

          <button
            className="rounded-full border-2 border-blue-600 border-opacity-50 p-2 text-blue-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
            onClick={() => mount(customer)}
          >
            <IconEdit size={16} stroke={3} />
          </button>

          <button
            className="rounded-full border-2 border-red-600 border-opacity-50 p-2 text-red-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
            onClick={() => onDelete(customer)}
          >
            <IconTrash size={16} stroke={3} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerTableItem;
