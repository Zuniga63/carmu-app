import React from 'react';
import { ActionIcon, Button, Table } from '@mantine/core';
import FormSection from '../FormSection';
import FormSectionCard from '../FormSectionCard';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import {
  configSelector,
  editCommercialPremise,
  selectCommercialPremise,
  showPremiseForm,
} from 'src/features/Config';
import PremiseFormModal from './PremiseFormModal';
import {
  IconBoxOff,
  IconBuildingStore,
  IconEdit,
  IconLock,
  IconLockOpen,
  IconMap2,
  IconPhone,
  IconTrash,
} from '@tabler/icons';

const StoreConfig = () => {
  const dispatch = useAppDispatch();
  const {
    commercialPremises: premises,
    fetchCommercialPremisesLoading: loading,
    commercialPremiseSelected: storeSelected,
  } = useAppSelector(configSelector);

  return (
    <>
      <FormSection
        title="Locales"
        description="This a generic description for component"
      >
        <FormSectionCard>
          <FormSectionCard.Body>
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th>Local</th>
                  <th>
                    <p className="text-center">Facturas</p>
                  </th>
                  <th>
                    <p className="text-center">Caja</p>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {premises.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-x-2">
                        {storeSelected && storeSelected.id === item.id ? (
                          <IconBuildingStore
                            size={24}
                            className="text-emerald-500"
                          />
                        ) : null}
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            dispatch(selectCommercialPremise(item.id))
                          }
                        >
                          <p className="font-bold">{item.name}</p>
                          {item.address ? (
                            <div className="flex items-center gap-x-2">
                              <IconMap2 size={18} />{' '}
                              <p className="text-center text-sm">
                                {item.address}
                              </p>
                            </div>
                          ) : null}
                          {item.phone ? (
                            <div className="flex items-center gap-x-2">
                              <IconPhone size={18} />{' '}
                              <p className="text-center text-sm">
                                {item.phone}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.invoices.length}</td>
                    <td>
                      <div className="flex justify-center">
                        {item.defaultBox ? (
                          <div className="flex gap-x-2">
                            {item.defaultBox.openBox ? (
                              <IconLockOpen
                                size={18}
                                className="text-green-500"
                              />
                            ) : (
                              <IconLock size={18} className="text-red-500" />
                            )}
                            {item.defaultBox.name}
                          </div>
                        ) : (
                          <IconBoxOff />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-x-2">
                        <ActionIcon
                          color="green"
                          onClick={() =>
                            dispatch(editCommercialPremise(item.id))
                          }
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon color="red" disabled>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </FormSectionCard.Body>
          <FormSectionCard.Footer>
            {loading ? (
              <span className="animate-pulse text-xs">Cargando locales...</span>
            ) : null}
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

export default StoreConfig;
