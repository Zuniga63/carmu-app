import type { NextPage } from 'next';
import { useAppSelector } from 'store/hooks';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import CashChart from 'components/dashboard/CashChart';

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
      {isAdmin && <CashChart />}
      <div className="px-8">
        <div className="flex min-h-screen flex-col items-center justify-center py-16 text-light">
          <h1 className="m-0 text-center text-5xl leading-tight">Bienvenido</h1>
          <p className="mt-4 text-center text-base leading-tight">
            Estas en tu plataforma de administración. Actualmente esta sección está vacía pero se ira actualizando
            conforme se vayan agregando nuevos modulos.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
