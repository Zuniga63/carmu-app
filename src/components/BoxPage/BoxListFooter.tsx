import { ActionIcon, Tooltip } from '@mantine/core';
import { IconBox, IconLock, IconLockOpen, IconWorld } from '@tabler/icons-react';
import { useMemo } from 'react';
import { currencyFormat } from '@/utils';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';
import { useBoxesPageStore } from '@/store/boxes-page-store';

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
          <Tooltip label="Cajas">
            <div className="flex gap-x-2 text-gray-dark dark:text-light">
              <IconBox size={16} />
              <span className="text-xs font-bold">{openBoxes + closeBoxes}</span>
            </div>
          </Tooltip>
          {/* BOXES DETAILS */}
          <div className="flex gap-x-2 text-gray-dark dark:text-light">
            <Tooltip label="Cajas abiertas">
              <div className="flex gap-x-2 text-emerald-500">
                <IconLockOpen size={16} />
                <span className="text-xs font-bold">{openBoxes}</span>
              </div>
            </Tooltip>

            <Tooltip label="Cajas cerradas">
              <div className="flex gap-x-2 text-red-500">
                <IconLock size={16} />
                <span className="text-xs font-bold">{closeBoxes}</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* GLOBAL BOX */}
        {boxesData?.mainBox ? (
          <Tooltip
            label={
              <div className="flex flex-col items-center">
                <span className="text-sm">{boxesData?.mainBox.name}</span>
                <span className="text-xs font-bold tracking-widest">{currencyFormat(boxesData?.mainBox.balance)}</span>
              </div>
            }
            withArrow
            color="grape"
          >
            <ActionIcon size={40} color="grape" onClick={handleMainBoxToInfoClick}>
              <IconWorld />
            </ActionIcon>
          </Tooltip>
        ) : null}

        <div className="flex flex-col items-end justify-center">
          <Tooltip label="Saldo">
            <p className="text-xs font-bold tracking-widest">{currencyFormat(balance)}</p>
          </Tooltip>
          {balance !== balanceWithoutBase ? (
            <Tooltip label="Saldo sin la base">
              <p className="text-xs font-bold tracking-widest">{currencyFormat(balanceWithoutBase)}</p>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

export default BoxListFooter;
