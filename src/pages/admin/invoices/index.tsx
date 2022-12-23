import { NextPage } from 'next';
import Layout from 'src/components/Layout';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useEffect } from 'react';
import InvoiceList from 'src/components/InvoicePage/InvoiceList';
import InvoiceForm from 'src/components/InvoicePage/InvoiceForm';
import InvoicePaymentForm from 'src/components/InvoicePage/InvoicePaymentForm';
import InvoiceCardModal from 'src/components/InvoicePage/InvoiceCardModal';
import WeeklyInvoiceChart from 'src/components/InvoicePage/WeeklyInvoiceChart';

import ChartJS from 'chart.js/auto';
import { Button } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons';
import CounterSaleForm from 'src/components/InvoicePage/CounterSaleForm';
import { authSelector } from 'src/features/Auth';
import {
  fetchInvoiceData,
  showCounterSaleForm,
} from 'src/features/InvoicePage';
ChartJS.register();

const InvoicePage: NextPage = () => {
  const { isAuth, isAdmin } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth && isAdmin) dispatch(fetchInvoiceData());
  }, [isAuth, isAdmin]);

  return (
    <Layout title="Facturación">
      <div className="relative grid items-start gap-y-4 gap-x-4 px-4 pt-4 lg:grid-cols-3 3xl:grid-cols-4">
        <InvoiceList />
        <div className="pr-8 lg:col-span-2 3xl:col-span-3">
          <WeeklyInvoiceChart />
        </div>
        <div className="fixed right-4 bottom-4 hidden lg:block">
          <Button
            leftIcon={<IconFileInvoice />}
            onClick={() => dispatch(showCounterSaleForm())}
          >
            Ventas por mostrador
          </Button>
        </div>
      </div>
      <InvoiceForm />
      <InvoiceCardModal />
      <InvoicePaymentForm />
      <CounterSaleForm />
    </Layout>
  );
};

export default InvoicePage;
