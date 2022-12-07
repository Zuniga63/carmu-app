import { NextPage } from 'next';
import Layout from 'components/Layout';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useEffect } from 'react';
import { fetchInvoiceData } from 'store/reducers/InvoicePage/creators';
import InvoiceList from 'components/InvoicePage/InvoiceList';
import InvoiceForm from 'components/InvoicePage/InvoiceForm';
import InvoicePaymentForm from 'components/InvoicePage/InvoicePaymentForm';
import InvoiceCardModal from 'components/InvoicePage/InvoiceCardModal';
import WeeklyInvoiceChart from 'components/InvoicePage/WeeklyInvoiceChart';

import ChartJS from 'chart.js/auto';
ChartJS.register();

const InvoicePage: NextPage = () => {
  const { isAuth, isAdmin } = useAppSelector(state => state.AuthReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth && isAdmin) dispatch(fetchInvoiceData());
  }, [isAuth, isAdmin]);

  return (
    <Layout title="Facturación">
      <div className="grid items-start gap-y-4 gap-x-4 px-4 pt-4 lg:grid-cols-3 3xl:grid-cols-4">
        <InvoiceList />
        <div className="pr-8 lg:col-span-2 3xl:col-span-3">
          <WeeklyInvoiceChart />
        </div>
      </div>
      <InvoiceForm />
      <InvoiceCardModal />
      <InvoicePaymentForm />
    </Layout>
  );
};

export default InvoicePage;
