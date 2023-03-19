import Layout from 'src/components/Layout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { authSelector } from 'src/features/Auth';
import { fetchBoxes } from 'src/features/BoxPage';
import { useEffect } from 'react';
import { fetchPremiseStores } from 'src/features/Config';
import PremiseStoreConfigComponent from 'src/components/ConfigPage/premise-stores/PremiseStoreConfigComponent';

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
