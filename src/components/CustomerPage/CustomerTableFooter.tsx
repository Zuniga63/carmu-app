import { Pagination, Tooltip } from '@mantine/core';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconSkull,
} from '@tabler/icons';

type Props = {
  page?: number;
  totalPages?: number;
  onUpdatePage?: (value: number) => void;
};

export default function CustomerTableFooter({
  page = 0,
  totalPages = 0,
  onUpdatePage,
}: Props) {
  return (
    <footer className="flex items-center justify-between rounded-b-md bg-gray-300 px-6 py-2 dark:bg-header">
      <div className="flex gap-x-2">
        <Tooltip label="Deuda de 0 a 3 meses" withArrow>
          <div>
            <IconCircleCheck size={24} className="text-green-500" />
          </div>
        </Tooltip>
        <Tooltip label="Deuda de 3 a 6 meses" withArrow>
          <div>
            <IconAlertCircle size={24} className="text-green-500" />
          </div>
        </Tooltip>
        <Tooltip label="Deuda de 6 a 9 meses" withArrow>
          <div>
            <IconCircleX size={24} className="text-green-500" />
          </div>
        </Tooltip>
        <Tooltip label="Superior a 9 meses" withArrow>
          <div>
            <IconSkull size={24} className="text-green-500" />
          </div>
        </Tooltip>
      </div>

      <div>
        {totalPages > 1 && (
          <Pagination total={totalPages} page={page} onChange={onUpdatePage} />
        )}
      </div>

      <div className="flex gap-x-2">
        <Tooltip label="Pago relaizado en los ultimos 28 días" withArrow>
          <div>
            <IconSkull size={24} className="text-green-500" />
          </div>
        </Tooltip>
        <Tooltip label="Ultimo pago hace mas de 28 día" withArrow>
          <div>
            <IconSkull size={24} className="text-amber-500" />
          </div>
        </Tooltip>
        <Tooltip label="Ultimo pago hace mas de 45 días" withArrow>
          <div>
            <IconSkull size={24} className="text-red-500" />
          </div>
        </Tooltip>
        <Tooltip label="Ultimo pago hace mas de 90 días" withArrow>
          <div>
            <IconSkull size={24} className="text-purple-500" />
          </div>
        </Tooltip>
      </div>
    </footer>
  );
}
