import { GetServerSideProps, NextPage } from 'next';
import Layout from 'components/Layout';
import { IInvoicePageData } from 'types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useEffect } from 'react';
import { mountInvoiceData } from 'store/reducers/InvoicePage/creators';
import InvoiceList from 'components/InvoicePage/InvoiceList';
import InvoiceForm from 'components/InvoicePage/InvoiceForm';
import InvoiceCard from 'components/InvoicePage/InvoiceCard';
import EmptyInvoice from 'components/InvoicePage/EmptyInvoice';
import InvoicePaymentForm from 'components/InvoicePage/InvoicePaymentForm';

interface Props {
  initialData: IInvoicePageData;
}

const InvoicePage: NextPage<Props> = ({ initialData }) => {
  const { invoiceSelected } = useAppSelector(state => state.InvoicePageReducer);
  const dispatch = useAppDispatch();

  useEffect(() => dispatch(mountInvoiceData(initialData)), []);
  return (
    <Layout title="Facturación">
      <div className="grid grid-cols-3 gap-x-4 px-4 pt-4 3xl:grid-cols-5">
        <InvoiceList />
        <div className="col-span-2 h-full 3xl:col-span-4">{invoiceSelected ? <InvoiceCard /> : <EmptyInvoice />}</div>
      </div>
      <InvoiceForm />
      <InvoicePaymentForm />
    </Layout>
  );
};

export default InvoicePage;

export const getServerSideProps: GetServerSideProps = async context => {
  const { token } = context.req.cookies;
  const data = {
    invoices: [],
    products: [],
    categories: [],
    customers: [],
    cashboxs: [],
  };

  if (token) {
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const url = `${baseUrl}/invoices`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(url, { headers });
      const resData = await res.json();
      const { invoices, products, categories, customers, cashboxs } = resData;

      data.invoices = invoices || [];
      data.products = products || [];
      data.categories = categories || [];
      data.customers = customers || [];
      data.cashboxs = cashboxs || [];
    } catch (error) {
      console.log(error);
    }
  }

  return {
    props: { initialData: data },
  };
};