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
} from '@tabler/icons-react';
import type { IPremiseStore } from '@/types';
import { currencyFormat } from '@/utils';
import { useConfigStore } from '@/store/config-store';

interface Props {
  premiseStore: IPremiseStore;
}

const PremiseStoreTableItem: React.FC<Props> = ({ premiseStore }) => {
  const premiseStoreSelected = useConfigStore(state => state.premiseStore);
  const setPremiseStore = useConfigStore(state => state.setPremiseStore);
  const showForm = useConfigStore(state => state.showPremiseStoreForm);

  const isSelected = premiseStoreSelected ? premiseStoreSelected.id === premiseStore.id : false;

  const onClick = () => {
    if (isSelected) setPremiseStore();
    else setPremiseStore(premiseStore);
  };

  const handleEditPremiseStore = () => {
    showForm(premiseStore.id);
  };

  return (
    <tr>
      <td>
        <div className="flex items-center gap-x-2">
          <ActionIcon size="xl" color="yellow" onClick={onClick}>
            <IconBuildingStore
              size={24}
              className={isSelected ? 'text-emerald-500 transition-colors' : 'text-gray-400 transition-colors'}
            />
          </ActionIcon>
          <div className="cursor-pointer">
            <p className="font-bold">{premiseStore.name}</p>
            {premiseStore.address ? (
              <div className="flex items-center gap-x-2">
                <IconMap2 size={18} /> <p className="text-sm">{premiseStore.address}</p>
              </div>
            ) : null}
            {premiseStore.phone ? (
              <div className="flex items-center gap-x-2">
                <IconPhone size={18} /> <p className="text-sm">{premiseStore.phone}</p>
              </div>
            ) : null}
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap text-center">{premiseStore.invoices.length}</td>
      <td className="whitespace-nowrap text-center">{currencyFormat(premiseStore.weeklySales)}</td>
      <td className="whitespace-nowrap text-center">{currencyFormat(premiseStore.monthlySales)}</td>
      <td className="whitespace-nowrap">
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
          <ActionIcon color="green" onClick={handleEditPremiseStore}>
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
