import Layout from '@/components/Layout';
import { NextPage } from 'next';
import PremiseStoreConfigComponent from '@/components/ConfigPage/premise-stores/PremiseStoreConfigComponent';

const ConfigPage: NextPage = () => {
  return (
    <Layout title="Configuraciones">
      <PremiseStoreConfigComponent />
    </Layout>
  );
};

export default ConfigPage;
