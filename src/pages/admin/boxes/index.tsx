import BoxList from '@/components/BoxPage/BoxList';
import BoxShow from '@/components/BoxPage/BoxShow';
import CloseBoxForm from '@/components/BoxPage/CloseBoxForm';
import CreateForm from '@/components/BoxPage/CreateForm';
import OpenBoxForm from '@/components/BoxPage/OpenBoxForm';
import Layout from '@/components/Layout';
import { NextPage } from 'next';
import CreateTransactionForm from '@/components/BoxPage/CreateTransactionForm';
import BoxDeleteDialog from '@/components/BoxPage/BoxDeleteDialog';
import TransactionDeleteDialog from '@/components/BoxPage/TransactionDeleteDialog';

const BoxesPage: NextPage = () => {
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
      <BoxDeleteDialog />
      <TransactionDeleteDialog />
    </>
  );
};

export default BoxesPage;
