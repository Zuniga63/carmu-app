import { NextPage } from 'next';
import Layout from 'src/components/Layout';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useEffect } from 'react';
import InvoiceList from 'src/components/InvoicePage/InvoiceList';
import InvoiceForm from 'src/components/InvoicePage/InvoiceForm';
import InvoicePaymentForm from 'src/components/InvoicePage/InvoicePaymentForm';
import InvoiceCardModal from 'src/components/InvoicePage/InvoiceCardModal';
import WeeklyInvoiceChart from 'src/components/InvoicePage/WeeklyInvoiceChart';

import CounterSaleForm from 'src/components/InvoicePage/CounterSaleForm';
import { authSelector } from 'src/features/Auth';
import {
  fetchInvoiceData,
  invoicePageSelector,
  refreshInvoices,
} from 'src/features/InvoicePage';
import { fetchCustomers } from 'src/features/CustomerPage';
import { fetchBoxes } from 'src/features/BoxPage';
import { fetchCategories } from 'src/features/CategoryPage';
import CancelInvoicePaymentForm from 'src/components/InvoicePage/CancelInvoicePaymentForm';
import CancelInvoiceForm from 'src/components/InvoicePage/CancelInvoiceForm';

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
      <div className="grid items-start gap-y-4 gap-x-4 px-4 pt-4 pb-8 lg:grid-cols-3 3xl:grid-cols-4 3xl:px-8">
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
