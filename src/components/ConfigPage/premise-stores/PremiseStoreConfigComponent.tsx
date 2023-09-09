import React from 'react';
import { Button } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { configSelector, showPremiseForm } from '@/features/Config';
import PremiseFormModal from '../premise-stores/PremiseFormModal';

import FormSection from '@/components/FormSection';
import FormSectionCard from '@/components/FormSectionCard';
import PremiseStoreTable from './PremiseStoreTable';

const PremiseStoreConfigComponent = () => {
  const dispatch = useAppDispatch();
  const { fetchPremiseStoresLoading: loading } = useAppSelector(configSelector);

  return (
    <>
      <FormSection title="Locales" description="This a generic description for component">
        <FormSectionCard>
          <FormSectionCard.Body>
            <PremiseStoreTable />
          </FormSectionCard.Body>
          <FormSectionCard.Footer>
            {loading ? <span className="animate-pulse text-xs">Cargando locales...</span> : null}
            <Button size="xs" onClick={() => dispatch(showPremiseForm())}>
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
