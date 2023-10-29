import { Modal, Tabs } from '@mantine/core';
import { IconCashBanknote, IconFileInvoice } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { IInvoicePaymentBase } from '@/types';
import CustomerInfoInvoices from './CustomerInfoInvoices';
import CustomerInfoPayments from './CustomerInfoPayments';
import CustomerInfoTitle from './CustomerInfoTitle';
import { useGetCustomerById } from '@/hooks/react-query/customers.hooks';
import { useCustomerPageStore } from '@/store/customer-store';

const CustomerInfo = () => {
  const customerId = useCustomerPageStore(state => state.customerToInfo);
  const closeModal = useCustomerPageStore(state => state.unmoutCustomerToInfo);

  const [isOpen, setIsOpen] = useState(false);
  const [payments, setPayments] = useState<IInvoicePaymentBase[]>([]);
  const { data: customer } = useGetCustomerById({ id: customerId });

  const handleClose = () => {
    closeModal();
  };

  useEffect(() => {
    setIsOpen(Boolean(customer));
    const paymentList: IInvoicePaymentBase[] = [];
    if (customer) {
      customer.invoices.forEach(invoice => {
        invoice.payments.forEach(payment => {
          if (!payment.cancel) {
            if (paymentList.some(p => p.paymentDate === payment.paymentDate)) {
              const oldPayment = paymentList.find(p => p.paymentDate === payment.paymentDate);
              if (oldPayment) {
                oldPayment.amount += payment.amount;
              }
            } else {
              paymentList.push({ ...payment });
            }
          }
        });
      });

      paymentList.sort((p1, p2) => p1.paymentDate.localeCompare(p2.paymentDate));
    }

    setPayments(paymentList);
  }, [customer]);

  return customer ? (
    <Modal opened={isOpen} onClose={handleClose} title={<CustomerInfoTitle customer={customer} />} size="70%">
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
