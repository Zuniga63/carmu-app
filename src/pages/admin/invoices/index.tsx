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
import { fetchInvoiceData, invoicePageSelector, refreshInvoices } from '@/features/InvoicePage';
import CancelInvoicePaymentForm from '@/components/InvoicePage/CancelInvoicePaymentForm';
import CancelInvoiceForm from '@/components/InvoicePage/CancelInvoiceForm';
import { useAuthStore } from '@/store/auth-store';
import InvoiceToPrintModal from '@/components/InvoicePage/invoice-to-print-modal';

const InvoicePage: NextPage = () => {
  const isAuth = useAuthStore(state => state.isAuth);
  const isAdmin = useAuthStore(state => state.isAdmin);

  const { firstLoading } = useAppSelector(invoicePageSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth && isAdmin) {
      if (firstLoading) {
        dispatch(fetchInvoiceData());
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
      <InvoiceToPrintModal />
    </Layout>
  );
};

export default InvoicePage;
