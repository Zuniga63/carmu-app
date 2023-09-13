import React from 'react';
import { Button } from '@mantine/core';
import PremiseFormModal from '../premise-stores/PremiseFormModal';

import FormSection from '@/components/FormSection';
import FormSectionCard from '@/components/FormSectionCard';
import PremiseStoreTable from './PremiseStoreTable';
import { useGetAllPremiseStore } from '@/hooks/react-query/premise-store.hooks';
import { useConfigStore } from '@/store/config-store';

const PremiseStoreConfigComponent = () => {
  const { isInitialLoading: loading } = useGetAllPremiseStore();
  const showForm = useConfigStore(state => state.showPremiseStoreForm);

  return (
    <>
      <FormSection title="Locales" description="This a generic description for component">
        <FormSectionCard>
          <FormSectionCard.Body>
            <PremiseStoreTable />
          </FormSectionCard.Body>
          <FormSectionCard.Footer>
            {loading ? <span className="animate-pulse text-xs">Cargando locales...</span> : null}
            <Button size="xs" onClick={() => showForm()}>
              Agregar Local
            </Button>
          </FormSectionCard.Footer>
        </FormSectionCard>
      </FormSection>

      <PremiseFormModal />
    </>
  );
};

export default PremiseStoreConfigComponent;
