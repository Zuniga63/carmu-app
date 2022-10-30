import { IconDeviceMobile, IconEdit, IconMail, IconMapPin, IconTrash } from '@tabler/icons';
import dayjs from 'dayjs';
import React from 'react';
import { ICustomer } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  customer: ICustomer;
  mount(customer: ICustomer): void;
  onDelete(customer: ICustomer): Promise<void>;
}

const CustomerTableItem = ({ customer, mount, onDelete }: Props) => {
  return (
    <tr className="text-gray-300">
      <td className="whitespace-nowrap px-3 py-2">
        <div className="text-center">
          <p>{customer.fullName}</p>
          {Boolean(customer.documentNumber) && (
            <p className="text-sm">
              <span>{customer.documentType}</span>: {customer.documentNumber}
            </p>
          )}
          {Boolean(customer.alias) && <p className="text-xs text-light text-opacity-50">({customer.alias})</p>}
        </div>
      </td>
      <td className="px-3 py-2 text-center text-sm">
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
                <div className="flex items-center gap-x-2 text-xs" key={contact.id}>
                  <IconDeviceMobile size={16} />
                  <p>{contact.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="px-3 py-2 text-right text-sm">
        <div className="flex flex-col items-center text-xs">
          {customer.firstPendingInvoice ? (
            <p>Fact. más antigua {dayjs(customer.firstPendingInvoice).fromNow()}</p>
          ) : null}
          {customer.lastPendingInvoice && customer.lastPendingInvoice !== customer.firstPendingInvoice ? (
            <p>Fact. más reciente {dayjs(customer.lastPendingInvoice).fromNow()}</p>
          ) : null}
          {customer.lastPayment ? <p>Ultimo pago {dayjs(customer.lastPayment).fromNow()}</p> : null}
          <p className="italic text-neutral-400">Registro {dayjs(customer.createdAt).fromNow()}</p>
        </div>
      </td>
      <td className={`px-3 py-2 text-right tracking-widest`}>
        {customer.balance ? currencyFormat(customer.balance) : ''}
      </td>
      <td className="px-3 py-2 text-sm">
        <div className="flex gap-x-2">
          <button className="rounded-full border-2 border-blue-600 border-opacity-50 p-2 text-blue-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100">
            <IconEdit size={16} stroke={3} onClick={() => mount(customer)} />
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
