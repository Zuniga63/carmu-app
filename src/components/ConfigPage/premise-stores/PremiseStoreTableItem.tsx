import React, { useEffect, useState } from 'react';
import { ActionIcon } from '@mantine/core';
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
import { IPremiseStore } from 'src/features/Config/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import {
  configSelector,
  editPremiseStore,
  selectCommercialPremise,
  unselectPremiseStore,
} from 'src/features/Config';

interface Props {
  premiseStore: IPremiseStore;
}

const PremiseStoreTableItem: React.FC<Props> = ({ premiseStore }) => {
  const { premiseStoreSelected } = useAppSelector(configSelector);
  const dispatch = useAppDispatch();

  const [isSelected, setIsSelected] = useState(false);

  const onClick = () => {
    if (isSelected) dispatch(unselectPremiseStore());
    else dispatch(selectCommercialPremise(premiseStore.id));
  };

  useEffect(() => {
    setIsSelected(
      Boolean(
        premiseStoreSelected && premiseStoreSelected.id === premiseStore.id
      )
    );
  }, [premiseStoreSelected]);

  return (
    <tr>
      <td>
        <div className="flex items-center gap-x-2">
          <ActionIcon size="xl" color="yellow" onClick={onClick}>
            <IconBuildingStore
              size={24}
              className={
                isSelected
                  ? 'text-emerald-500 transition-colors'
                  : 'text-gray-400 transition-colors'
              }
            />
          </ActionIcon>
          <div className="cursor-pointer">
            <p className="font-bold">{premiseStore.name}</p>
            {premiseStore.address ? (
              <div className="flex items-center gap-x-2">
                <IconMap2 size={18} />{' '}
                <p className="text-center text-sm">{premiseStore.address}</p>
              </div>
            ) : null}
            {premiseStore.phone ? (
              <div className="flex items-center gap-x-2">
                <IconPhone size={18} />{' '}
                <p className="text-center text-sm">{premiseStore.phone}</p>
              </div>
            ) : null}
          </div>
        </div>
      </td>
      <td className="text-center">{premiseStore.invoices.length}</td>
      <td>
        <div className="flex justify-center">
          {premiseStore.defaultBox ? (
            <div className="flex gap-x-2">
              {premiseStore.defaultBox.openBox ? (
                <IconLockOpen size={18} className="text-green-500" />
              ) : (
                <IconLock size={18} className="text-red-500" />
              )}
              {premiseStore.defaultBox.name}
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
            onClick={() => dispatch(editPremiseStore(premiseStore.id))}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon color="red" disabled>
            <IconTrash size={16} />
          </ActionIcon>
        </div>
      </td>
    </tr>
  );
};

export default PremiseStoreTableItem;
