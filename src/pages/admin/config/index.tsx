import Layout from '@/components/Layout';
import { NextPage } from 'next';
import { useAppDispatch } from '@/store/hooks';
import { fetchBoxes } from '@/features/BoxPage';
import { useEffect } from 'react';
import { fetchPremiseStores } from '@/features/Config';
import PremiseStoreConfigComponent from '@/components/ConfigPage/premise-stores/PremiseStoreConfigComponent';
import { useAuthStore } from '@/store/auth-store';

const ConfigPage: NextPage = () => {
  const isAuth = useAuthStore(state => state.isAuth);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth && isAdmin) {
      dispatch(fetchBoxes());
      dispatch(fetchPremiseStores());
    }
  }, [isAuth, isAdmin]);

  return (
    <Layout title="Configuraciones">
      <PremiseStoreConfigComponent />
    </Layout>
  );
};

export default ConfigPage;
