import { NextPage } from 'next';
import Layout from '@/components/Layout';
import InvoiceList from '@/components/InvoicePage/InvoiceList';
import InvoiceForm from '@/components/InvoicePage/InvoiceForm';
import InvoiceCardModal from '@/components/InvoicePage/InvoiceCardModal';
import WeeklyInvoiceChart from '@/components/InvoicePage/WeeklyInvoiceChart';

import CounterSaleForm from '@/components/InvoicePage/CounterSaleForm';
import { useEffect } from 'react';
import { useInvoicePageStore } from '@/store/invoices-page.store';

import InvoiceToPrintModal from '@/components/InvoicePage/invoice-to-print-modal';

const InvoicePage: NextPage = () => {
  const resetState = useInvoicePageStore(state => state.resetState);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  return (
    <Layout title="Facturación">
      <div className="grid items-start gap-x-4 gap-y-4 px-4 pb-8 pt-4 lg:grid-cols-3 3xl:grid-cols-4 3xl:px-8">
        <InvoiceList />
        <div className="pr-8 lg:col-span-2 3xl:col-span-3">
          <WeeklyInvoiceChart />
        </div>
      </div>
      <InvoiceForm />
      <CounterSaleForm />
      <InvoiceCardModal />
      <InvoiceToPrintModal />
    </Layout>
  );
};

export default InvoicePage;
