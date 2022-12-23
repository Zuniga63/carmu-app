import React from 'react';
import {
  IInvoiceSummary,
  INewInvoiceItem,
  INewInvoicePayment,
} from 'src/types';
import { IInvoiceCustomer } from './InvoiceForm';
import InvoiceFormItemList from './InvoiceFormItemList';
import InvoiceFormPaymentList from './InvoiceFormPaymentList';

interface Props {
  customer: IInvoiceCustomer;
  items: INewInvoiceItem[];
  payments: INewInvoicePayment[];
  summary: IInvoiceSummary;
}

const InvoiceFormConfirm: React.FC<Props> = ({
  customer,
  items,
  payments,
  summary,
}) => {
  return (
    <div className="relative mt-4 grid grid-cols-3 items-start gap-x-4">
      {/* CUSTOMER */}
      <div className="sticky top-0 rounded-md border border-gray-300 bg-gray-100 px-8 py-4 shadow dark:border-gray-700 dark:bg-header">
        <h2 className="mb-4 text-center text-xl font-bold text-dark dark:text-light">
          Información del Cliente
        </h2>
        <div className="flex flex-col gap-y-1 text-sm text-gray-dark dark:text-light">
          <p>
            Nombre:{' '}
            <span className="font-bold">{customer.name || 'Mostrador'}</span>
          </p>
          <p>
            Documento:{' '}
            <span className="font-bold">
              {customer.document
                ? `${customer.documentType} ${customer.document}`
                : 'N/A'}
            </span>
          </p>
          <p>
            Dirección:{' '}
            <span className="font-bold">{customer.address || 'N/A'}</span>
          </p>
          <p>
            Teléfono:{' '}
            <span className="font-bold">{customer.phone || 'N/A'}</span>
          </p>
        </div>
      </div>

      {/* INFO */}
      <div className="col-span-2">
        <div className="mb-4">
          <InvoiceFormItemList items={items} removeItem={() => null} />
        </div>
        <InvoiceFormPaymentList
          payments={payments}
          summary={summary}
          removePayment={() => null}
        />
      </div>
    </div>
  );
};

export default InvoiceFormConfirm;
