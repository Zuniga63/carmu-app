import { NextPage } from 'next';
import Layout from '@/components/Layout';
import CustomerTable from '@/components/CustomerPage/CustomerTable';
import CustomerForm from '@/components/CustomerPage/CustomerForm';
import CustomerPaymentModal from '@/components/CustomerPage/CustomerPaymentModal';
import CustomerInfo from '@/components/CustomerPage/CustomerInfo';
import CustomerDeleteDialog from '@/components/CustomerPage/CustomerDeleteDialog';

const CustomerPage: NextPage = () => {
  return (
    <Layout title="Clientes">
      <CustomerTable />

      <CustomerForm />

      <CustomerPaymentModal />

      <CustomerInfo />
      <CustomerDeleteDialog />
    </Layout>
  );
};

export default CustomerPage;
