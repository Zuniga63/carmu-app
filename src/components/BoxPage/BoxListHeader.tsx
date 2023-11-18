import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCirclePlus, IconRefresh } from '@tabler/icons-react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { useBoxesPageStore } from '@/store/boxes-page-store';

const BoxListHeader = () => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: [ServerStateKeysEnum.Boxes] });
  const showForm = useBoxesPageStore(state => state.showForm);

  const handleReloadClick = () => {
    queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.Boxes] });
  };

  const handleCreateClick = () => {
    showForm();
  };

  return (
    <header className="rounded-t-md border-x border-t border-gray-400 bg-gray-300 px-4 py-2 dark:border-header dark:bg-header">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-wider">Cajas</h2>
        <div className="flex gap-x-2">
          <Tooltip label="Actualizar" withArrow>
            <ActionIcon onClick={handleReloadClick} loading={isFetching > 0} color="blue">
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Agregar Caja" withArrow>
            <ActionIcon onClick={handleCreateClick} color="green">
              <IconCirclePlus size={18} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default BoxListHeader;
