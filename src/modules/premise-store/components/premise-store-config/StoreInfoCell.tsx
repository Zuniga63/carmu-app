import { TableCell } from '@/components/ui/table';
import type { PremiseStore } from '../../interfaces';
import { Button } from '@/components/ui/Button';
import { IconBuildingStore, IconMap2, IconPhone } from '@tabler/icons-react';

interface StoreInfoCellProps {
  premiseStore: PremiseStore;
}

export default function StoreInfoCell({ premiseStore }: StoreInfoCellProps) {
  return (
    <TableCell >
      <div className="flex items-center gap-x-2">
        <Button size={'icon'} variant={'ghost'} type="button">
          <IconBuildingStore />
        </Button>

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
    </TableCell>
  );
}
