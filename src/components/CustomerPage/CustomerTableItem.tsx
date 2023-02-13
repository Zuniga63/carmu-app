import { ActionIcon, Tooltip } from '@mantine/core';
import {
  IconAlertCircle,
  IconCash,
  IconCircleCheck,
  IconCircleX,
  IconDeviceMobile,
  IconEdit,
  IconFolder,
  IconMail,
  IconMapPin,
  IconSkull,
  IconTrash,
} from '@tabler/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  customerPageSelector,
  deleteCustomer,
  fetchCustomer,
  mountCustomerToFetch,
  mountCustomerToPayment,
  mountCustomerToUpdate,
} from 'src/features/CustomerPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ICustomer } from 'src/types';
import { currencyFormat } from 'src/utils';

interface Props {
  customer: ICustomer;
}

const CustomerTableItem = ({ customer }: Props) => {
  const { fetchCustomerId } = useAppSelector(customerPageSelector);
  const [customerState, setCustomerState] = useState(
    <IconCircleCheck size={40} className="text-green-500" />
  );

  const dispatch = useAppDispatch();

  const onFetchCustomer = () => {
    dispatch(mountCustomerToFetch(customer.id));
    dispatch(fetchCustomer(customer.id));
  };

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
        <div className="flex items-center justify-end gap-x-2">
          {customer.balance ? (
            <Tooltip label="Hacer abono" withArrow>
              <ActionIcon
                size="lg"
                color="green"
                onClick={() => dispatch(mountCustomerToPayment(customer.id))}
                radius="xl"
              >
                <IconCash size={18} stroke={2} />
              </ActionIcon>
            </Tooltip>
          ) : null}

          <Tooltip label="Ver información" withArrow>
            <ActionIcon
              size="lg"
              color="grape"
              onClick={onFetchCustomer}
              radius="xl"
              loading={fetchCustomerId === customer.id}
            >
              <IconFolder size={18} stroke={2} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Actualizar Cliente" withArrow>
            <ActionIcon
              size="lg"
              color="blue"
              onClick={() => dispatch(mountCustomerToUpdate(customer.id))}
              radius="xl"
            >
              <IconEdit size={18} stroke={2} />
            </ActionIcon>
          </Tooltip>

          {!Boolean(customer.balance) ? (
            <Tooltip label="Eliminar Cliente" withArrow>
              <ActionIcon
                size="lg"
                color="red"
                onClick={() => dispatch(deleteCustomer(customer.id))}
                radius="xl"
              >
                <IconTrash size={16} stroke={2} />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </div>
      </td>
    </tr>
  );
};

export default CustomerTableItem;
