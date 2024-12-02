import { Metadata } from 'next';

import { PremiseStoreConfig } from '@/modules/premise-store/components/premise-store-config';

export const metadata: Metadata = {
  title: 'Configuración de la aplicación',
};

export default function AppConfigPage() {
  return (
    <div className="min-h-screen">
      <PremiseStoreConfig />
    </div>
  );
}
