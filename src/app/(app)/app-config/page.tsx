import { Metadata } from 'next';

import { PremiseStoreConfig, CreateNewPremiseStore } from '@/modules/premise-store/components';

export const metadata: Metadata = {
  title: 'Configuración de la aplicación',
};

export default function AppConfigPage() {
  return (
    <div className="min-h-screen">
      <PremiseStoreConfig />
      <CreateNewPremiseStore />
    </div>
  );
}
