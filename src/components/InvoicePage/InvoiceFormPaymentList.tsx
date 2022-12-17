import React from 'react';
import { Table } from '@mantine/core';
import { IInvoiceSummary, INewInvoicePayment } from 'src/types';
import InvoiceFormPaymentListItem from './InvoiceFormPaymentListItem';
import InvoiceFormSummary from './InvoiceFormSummary';

interface Props {
  payments: INewInvoicePayment[];
  removePayment(paymentId: number): void;
  summary: IInvoiceSummary;
}

const InvoiceFormPaymentList = ({
  payments,
  removePayment,
  summary,
}: Props) => {
  return (
    <>
      <div className="mb-4 min-h-[10rem] rounded border border-gray-200 dark:border-gray-600">
        <Table striped highlightOnHover>
          <thead>
            <tr className="whitespace-nowrap text-gray-100">
              <th>
                <span className="block text-center">#</span>
              </th>
              <th scope="col">Caja</th>
              <th scope="col">
                <span className="text-center">Forma de pago</span>
              </th>
              <th scope="col">
                <span className="text-center">Importe</span>
              </th>
              <th scope="col" className="relative">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((item, index) => (
              <InvoiceFormPaymentListItem
                index={index}
                key={item.id}
                payment={item}
                onRemove={removePayment}
              />
            ))}
          </tbody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-80">
          <InvoiceFormSummary summary={summary} full />
        </div>
      </div>
    </>
  );
};

export default InvoiceFormPaymentList;
