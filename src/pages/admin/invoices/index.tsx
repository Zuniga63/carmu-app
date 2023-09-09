import { NextPage } from 'next';
import Layout from '@/components/Layout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import InvoiceList from '@/components/InvoicePage/InvoiceList';
import InvoiceForm from '@/components/InvoicePage/InvoiceForm';
import InvoicePaymentForm from '@/components/InvoicePage/InvoicePaymentForm';
import InvoiceCardModal from '@/components/InvoicePage/InvoiceCardModal';
import WeeklyInvoiceChart from '@/components/InvoicePage/WeeklyInvoiceChart';

import CounterSaleForm from '@/components/InvoicePage/CounterSaleForm';
import { authSelector } from '@/features/Auth';
import { fetchInvoiceData, invoicePageSelector, refreshInvoices } from '@/features/InvoicePage';
import { fetchCustomers } from '@/features/CustomerPage';
import { fetchBoxes } from '@/features/BoxPage';
import { fetchCategories } from '@/features/CategoryPage';
import CancelInvoicePaymentForm from '@/components/InvoicePage/CancelInvoicePaymentForm';
import CancelInvoiceForm from '@/components/InvoicePage/CancelInvoiceForm';

const InvoicePage: NextPage = () => {
  const { isAuth, isAdmin } = useAppSelector(authSelector);
  const { firstLoading } = useAppSelector(invoicePageSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth && isAdmin) {
      if (firstLoading) {
        dispatch(fetchInvoiceData());
        dispatch(fetchCustomers());
        dispatch(fetchBoxes());
        dispatch(fetchCategories());
      } else {
        dispatch(refreshInvoices());
      }
    }
  }, [isAuth, isAdmin]);

  return (
    <Layout title="Facturación">
      <div className="grid items-start gap-x-4 gap-y-4 px-4 pb-8 pt-4 lg:grid-cols-3 3xl:grid-cols-4 3xl:px-8">
        <InvoiceList />
        <div className="pr-8 lg:col-span-2 3xl:col-span-3">
          <WeeklyInvoiceChart />
        </div>
      </div>
      <InvoiceForm />
      <InvoiceCardModal />
      <InvoicePaymentForm />
      <CounterSaleForm />
      <CancelInvoicePaymentForm />
      <CancelInvoiceForm />
    </Layout>
  );
};

export default InvoicePage;
