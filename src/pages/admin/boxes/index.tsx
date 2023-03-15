import BoxList from 'src/components/BoxPage/BoxList';
import BoxShow from 'src/components/BoxPage/BoxShow';
import CloseBoxForm from 'src/components/BoxPage/CloseBoxForm';
import CreateForm from 'src/components/BoxPage/CreateForm';
import OpenBoxForm from 'src/components/BoxPage/OpenBoxForm';
import Layout from 'src/components/Layout';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { fetchBoxes, unmountTransactions } from 'src/features/BoxPage';
import { authSelector } from 'src/features/Auth';
import CreateTransactionForm from 'src/components/BoxPage/CreateTransactionForm';

const BoxesPage: NextPage = () => {
  const { isAuth, isAdmin } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth && isAdmin) {
      dispatch(fetchBoxes());
    }

    return () => {
      dispatch(unmountTransactions());
    };
  }, [isAuth, isAdmin]);
  return (
    <>
      <Layout title="Cajas">
        <div className="gap-y-4 px-4 py-2 text-dark dark:text-light lg:flex lg:gap-y-0 lg:gap-x-4 lg:px-8">
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
