import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { IconCirclePlus, IconLoader, IconRefresh } from '@tabler/icons-react';

import { Button } from '../ui/Button';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';

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
          <Button size={'icon'} onClick={handleReloadClick} variant={'outline'} className="h-8 w-8">
            {isFetching > 0 ? <IconLoader size={18} className="animate-spin" /> : <IconRefresh size={18} />}
          </Button>

          <Button size={'icon'} onClick={handleCreateClick} variant={'outline'} className="h-8 w-8">
            <IconCirclePlus size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default BoxListHeader;
