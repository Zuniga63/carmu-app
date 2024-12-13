'use client';

import { ConfigForm, ConfigFormBody, ConfigFormFooter } from '@/components/config-form';
import { Button } from '@/components/ui/Button';
import { PremiseStoreConfigTable } from './PremiseStoreConfigTable';
import { useGetAllPremiseStore } from '../../hooks';
import { usePremisesStore } from '@/modules/premise-store/store';

export function PremiseStoreConfig() {
  const { data: premiseStores, isLoading } = useGetAllPremiseStore();
  const { setShowCreatePremiseModal } = usePremisesStore();

  return (
    <ConfigForm title="Locales" description="Panel de administración de sucursales o vendedores independientes">
      <ConfigFormBody>
        <PremiseStoreConfigTable premiseStores={premiseStores} />
      </ConfigFormBody>
      <ConfigFormFooter>
        <Button type="button" onClick={() => setShowCreatePremiseModal(true)}>
          Agregar sucursal
        </Button>
      </ConfigFormFooter>
    </ConfigForm>
  );
}
