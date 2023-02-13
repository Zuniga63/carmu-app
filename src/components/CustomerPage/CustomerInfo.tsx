import { Modal, Tabs } from '@mantine/core';
import { IconCashBanknote, IconFileInvoice } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import {
  customerPageSelector,
  unmountCustomer,
} from 'src/features/CustomerPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IInvoicePaymentBase } from 'src/types';
import CustomerInfoInvoices from './CustomerInfoInvoices';
import CustomerInfoPayments from './CustomerInfoPayments';
import CustomerInfoTitle from './CustomerInfoTitle';

const CustomerInfo = () => {
  const { customer } = useAppSelector(customerPageSelector);
  const dispatch = useAppDispatch();

  const [opened, setOpened] = useState(false);
  const [payments, setPayments] = useState<IInvoicePaymentBase[]>([]);

  useEffect(() => {
    setOpened(Boolean(customer));
    const paymentList: IInvoicePaymentBase[] = [];
    if (customer) {
      customer.invoices.forEach(invoice => {
        invoice.payments.forEach(payment => {
          if (!payment.cancel) {
            if (paymentList.some(p => p.paymentDate === payment.paymentDate)) {
              const oldPayment = paymentList.find(
                p => p.paymentDate === payment.paymentDate
              );
              if (oldPayment) {
                oldPayment.amount += payment.amount;
              }
            } else {
              paymentList.push({ ...payment });
            }
            // paymentList.push({ ...payment });
          }
        });
      });

      paymentList.sort((p1, p2) =>
        p1.paymentDate.localeCompare(p2.paymentDate)
      );
    }

    setPayments(paymentList);
  }, [customer]);

  return customer ? (
    <Modal
      opened={opened}
      onClose={() => dispatch(unmountCustomer())}
      title={<CustomerInfoTitle />}
      size="xl"
    >
      <Tabs defaultValue="invoices">
        <Tabs.List>
          <Tabs.Tab value="invoices" icon={<IconFileInvoice size={14} />}>
            Facturas
          </Tabs.Tab>
          <Tabs.Tab value="payments" icon={<IconCashBanknote size={14} />}>
            Pagos
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="invoices" pt="xs">
          <CustomerInfoInvoices invoices={customer.invoices} />
        </Tabs.Panel>

        <Tabs.Panel value="payments" pt="xs">
          <CustomerInfoPayments payments={payments} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  ) : null;
};

export default CustomerInfo;
