import Layout from '@/components/Layout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authSelector } from '@/features/Auth';
import { fetchBoxes } from '@/features/BoxPage';
import { useEffect } from 'react';
import { fetchPremiseStores } from '@/features/Config';
import PremiseStoreConfigComponent from '@/components/ConfigPage/premise-stores/PremiseStoreConfigComponent';

const ConfigPage: NextPage = () => {
  const { isAuth, isAdmin } = useAppSelector(authSelector);
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
