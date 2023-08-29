import { NextPage } from 'next';
import Layout from 'src/components/Layout';
import CustomerTable from 'src/components/CustomerPage/CustomerTable';
import { useEffect } from 'react';
import CustomerForm from 'src/components/CustomerPage/CustomerForm';
import { toast } from 'react-toastify';
import CustomerPaymentModal from 'src/components/CustomerPage/CustomerPaymentModal';
import { authSelector } from 'src/features/Auth';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { customerPageSelector, fetchCustomers } from 'src/features/CustomerPage';
import { fetchBoxes } from 'src/features/BoxPage';
import CustomerInfo from 'src/components/CustomerPage/CustomerInfo';

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
