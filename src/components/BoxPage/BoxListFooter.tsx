import { useMemo } from 'react';
import { IconBox, IconLock, IconLockOpen, IconWorld } from '@tabler/icons-react';

import { Button } from '../ui/Button';
import { currencyFormat } from '@/lib/utils';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';

const BoxListFooter = () => {
  const mountMainBox = useBoxesPageStore(state => state.mountMainBoxToInfo);

  const { data: boxesData } = useGetAllBoxes();

  const [openBoxes, closeBoxes, balance, balanceWithoutBase] = useMemo(() => {
    if (!boxesData) return [0, 0, 0, 0];
    const { boxes } = boxesData;

    let open = 0,
      close = 0,
      currentBalance = 0,
      currentBalanceWithoutBase = 0;

    boxes.forEach(box => {
      if (box.openBox) open += 1;
      else close += 1;

      if (box.balance) {
        currentBalance += box.balance;
        currentBalanceWithoutBase += box.balance - box.base;
      }
    });

    return [open, close, currentBalance, currentBalanceWithoutBase];
  }, [boxesData]);

  const handleMainBoxToInfoClick = () => {
    mountMainBox();
  };

  return (
    <footer className="min-h-[40px] rounded-b-md border-x border-b border-gray-400 bg-gray-300 px-4 py-2 dark:border-dark dark:bg-header">
      <div className="flex justify-between">
        {/* BOXES */}
        <div className="flex flex-col items-center gap-y-2">
          {/* ALL BOXES */}
          <div className="flex gap-x-2 text-gray-dark dark:text-light" title="Cajas">
            <IconBox size={16} />
            <span className="text-xs font-bold">{openBoxes + closeBoxes}</span>
          </div>
          {/* BOXES DETAILS */}
          <div className="flex gap-x-2 text-gray-dark dark:text-light">
            <div className="flex gap-x-2 text-emerald-500" title="Cajas abiertas">
              <IconLockOpen size={16} />
              <span className="text-xs font-bold">{openBoxes}</span>
            </div>

            <div className="flex gap-x-2 text-red-500" title="Cajas cerradas">
              <IconLock size={16} />
              <span className="text-xs font-bold">{closeBoxes}</span>
            </div>
          </div>
        </div>

        {/* GLOBAL BOX */}
        {boxesData?.mainBox ? (
          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={handleMainBoxToInfoClick}
            title={`Saldo global: ${currencyFormat(boxesData?.mainBox.balance)}`}
          >
            <IconWorld />
          </Button>
        ) : null}

        <div className="flex flex-col items-end justify-center">
          <p className="text-xs font-bold tracking-widest" title="Saldo">
            {currencyFormat(balance)}
          </p>
          {balance !== balanceWithoutBase ? (
            <p className="text-xs font-bold tracking-widest" title="Saldo sin la base">
              {currencyFormat(balanceWithoutBase)}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

export default BoxListFooter;
