'use client';

import { ConfigForm, ConfigFormBody, ConfigFormFooter } from '@/components/config-form';
import { Button } from '@/components/ui/Button';
import { PremiseStoreConfigTable } from './PremiseStoreConfigTable';
import { useGetAllPremiseStore } from '../../hooks';

export function PremiseStoreConfig() {
  const { data: premiseStores, isLoading } = useGetAllPremiseStore();

  return (
    <ConfigForm title="Locales" description="Panel de administración de sucursales o vendedores independientes">
      <ConfigFormBody>
        <PremiseStoreConfigTable premiseStores={premiseStores} />
      </ConfigFormBody>
      <ConfigFormFooter>
        <Button>Agregar sucursal</Button>
      </ConfigFormFooter>
    </ConfigForm>
  );
}
