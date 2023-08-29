import { NextPage } from 'next';
import Layout from '@/components/Layout';
import CustomerTable from '@/components/CustomerPage/CustomerTable';
import { useEffect } from 'react';
import CustomerForm from '@/components/CustomerPage/CustomerForm';
import { toast } from 'react-toastify';
import CustomerPaymentModal from '@/components/CustomerPage/CustomerPaymentModal';
import { authSelector } from '@/features/Auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { customerPageSelector, fetchCustomers } from '@/features/CustomerPage';
import { fetchBoxes } from '@/features/BoxPage';
import CustomerInfo from '@/components/CustomerPage/CustomerInfo';

const CustomerPage: NextPage = () => {
  const { isAuth } = useAppSelector(authSelector);
  const { fetchError } = useAppSelector(customerPageSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchCustomers());
      dispatch(fetchBoxes());
    }
  }, [isAuth]);

  useEffect(() => {
    if (fetchError) {
      toast.error('Error al recuperar los clientes');
    }
  }, [fetchError]);

  return (
    <Layout title="Clientes">
      <CustomerTable />

      <CustomerForm />

      <CustomerPaymentModal />

      <CustomerInfo />
    </Layout>
  );
};

export default CustomerPage;
