import type { NextPage } from 'next';

import Layout from '@/components/Layout';
import CashChart from '@/components/dashboard/CashChart';

import ReportStatistics from '@/components/dashboard/ReportStatistics';
import CreditEvolution from '@/components/dashboard/CreditEvolution';
import { useAuthStore } from '@/store/auth-store';
import { useConfigStore } from '@/store/config-store';

const Home: NextPage = () => {
  const user = useAuthStore(state => state.user);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const premiseStore = useConfigStore(state => state.premiseStore);

  return (
    <Layout title="Dashboard">
      <div className="px-4 pb-40 lg:px-8">
        <div className="mb-2 flex flex-col items-center justify-center py-8 text-dark dark:text-light">
          <h1 className="m-0 text-center text-2xl leading-tight">Bienvenido {user?.name}</h1>
          {premiseStore && <p className="text-sm italic">{premiseStore.name}</p>}
        </div>
        {isAdmin ? (
          <>
            <div className="mb-4">
              <CreditEvolution />
            </div>
            <div className="mb-4">
              <ReportStatistics />
            </div>
            <div className="mb-8">
              <CashChart />
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
};

export default Home;
