import BoxList from 'src/components/BoxPage/BoxList';
import BoxShow from 'src/components/BoxPage/BoxShow';
import CloseBoxForm from 'src/components/BoxPage/CloseBoxForm';
import CreateForm from 'src/components/BoxPage/CreateForm';
import OpenBoxForm from 'src/components/BoxPage/OpenBoxForm';
import Layout from 'src/components/Layout';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useAppDispatch } from 'src/store/hooks';
import { fetchBoxes, unmountTransactions } from 'src/features/BoxPage';

const BoxesPage: NextPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoxes());

    return () => {
      dispatch(unmountTransactions());
    };
  }, []);
  return (
    <>
      <Layout title="Cajas">
        <div className="flex gap-x-4 px-8 py-2 text-dark dark:text-light">
          <div className="w-80 flex-shrink-0 flex-grow-0">
            <BoxList />
          </div>
          <div className="flex-grow">
            <BoxShow />
          </div>
        </div>
      </Layout>
      <CreateForm />
      <OpenBoxForm />
      <CloseBoxForm />
    </>
  );
};

export default BoxesPage;
