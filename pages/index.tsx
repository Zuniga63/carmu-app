import type { NextPage } from 'next';
import { useAppSelector } from 'store/hooks';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import CashChart from 'components/dashboard/CashChart';
import ChartJS from 'chart.js/auto';
import SaleStatistics from 'components/dashboard/SaleStatistics';

ChartJS.defaults.color = '#ccc';

const Home: NextPage = () => {
  const { isAuth, loginIsSuccess, user, isAdmin } = useAppSelector(state => state.AuthReducer);
  const router = useRouter();
  const firtsRenderRef = useRef(true);

  useEffect(() => {
    if (firtsRenderRef.current) {
      firtsRenderRef.current = false;
      return;
    }
    if (!isAuth) {
      router.push('/login');
      return;
    }
    if (loginIsSuccess) {
      const message = (
        <span>
          ¡Bienvenido <strong className="font-bold">{user?.name}</strong>!
        </span>
      );
      toast.success(message, { position: 'top-right' });
    }
  }, [isAuth, loginIsSuccess]);

  return (
    <Layout title="Dashboard">
      <div className="px-8 pb-40">
        <div className="mb-2 flex flex-col items-center justify-center py-8 text-light">
          <h1 className="m-0 text-center text-2xl leading-tight">Bienvenido {user?.name}</h1>
          <p className="mt-4 text-center text-sm leading-tight">
            Sección en continua actualización, actualmente se encuentra implementado el flujo de caja y el flujo de
            ventas.
          </p>
        </div>
        {isAdmin && (
          <>
            <div className="mb-8">
              <CashChart />
            </div>
            <div className="mb-4">
              <SaleStatistics />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
