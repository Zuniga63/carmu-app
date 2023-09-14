import BoxList from '@/components/BoxPage/BoxList';
import BoxShow from '@/components/BoxPage/BoxShow';
import CloseBoxForm from '@/components/BoxPage/CloseBoxForm';
import CreateForm from '@/components/BoxPage/CreateForm';
import OpenBoxForm from '@/components/BoxPage/OpenBoxForm';
import Layout from '@/components/Layout';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { unmountTransactions } from '@/features/BoxPage';
import CreateTransactionForm from '@/components/BoxPage/CreateTransactionForm';

const BoxesPage: NextPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(unmountTransactions());
    };
  }, []);

  return (
    <>
      <Layout title="Cajas">
        <div className="gap-y-4 px-4 py-2 text-dark dark:text-light lg:flex lg:gap-x-4 lg:gap-y-0 lg:px-8">
          <div className="mb-4 w-full lg:mb-0 lg:w-80 lg:flex-shrink-0 lg:flex-grow-0">
            <BoxList />
          </div>
          <div className="w-full overflow-x-auto lg:flex-grow">
            <BoxShow />
          </div>
        </div>
      </Layout>
      <CreateForm />
      <OpenBoxForm />
      <CloseBoxForm />
      <CreateTransactionForm />
    </>
  );
};

export default BoxesPage;
