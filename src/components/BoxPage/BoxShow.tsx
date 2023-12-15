import { ActionIcon, Button, ScrollArea, Tooltip } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { IconFileDescription, IconWriting } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { currencyFormat } from '@/lib/utils';
import TransactionReport from './TransactionReport';
import TransactionTable from './TransactionTable';
import WaitingBox from './WaitingBox';
import { useBoxShow } from '@/hooks/boxes-page/use-box-show';

const BoxShow = () => {
  const {
    waiting,
    loading,
    boxName,
    rangeDate,
    reportOpened,
    transactions,
    balance,
    isMainBox,
    setReportOpened,
    setRangeDate,
    showTransactionForm,
  } = useBoxShow();

  const addHandler = () => showTransactionForm();

  if (waiting) return <WaitingBox loading={loading} />;

  return (
    <>
      <div className="w-full">
        <header className="rounded-t-md bg-gray-300 px-6 py-2 dark:bg-header">
          <h2 className="text-center text-xl font-bold tracking-wider">{boxName}</h2>
          {isMainBox ? (
            <DateRangePicker
              placeholder="Selecciona una fecha"
              size="xs"
              value={rangeDate}
              onChange={setRangeDate}
              maxDate={dayjs().toDate()}
              inputFormat="DD-MM-YYYY"
            />
          ) : null}
        </header>
        <ScrollArea className="relative h-[23rem] overflow-y-auto border border-y-0 border-x-gray-400 dark:border-x-header 3xl:h-[40rem]">
          <TransactionTable transactions={transactions} />
        </ScrollArea>
        <footer className="flex items-center justify-between rounded-b-md bg-gray-300 px-6 py-2 dark:bg-header">
          <div className="flex flex-col items-center gap-y-1 lg:flex-row lg:gap-x-2">
            <span className="text-xs lg:text-base">Saldo:</span>
            <span className="text-center text-xs font-bold lg:text-base">{currencyFormat(balance)}</span>
          </div>

          <div className="hidden lg:block">Registros: {transactions.length}</div>

          <div className="flex items-center gap-x-4">
            <Tooltip label="Ver informe">
              <ActionIcon color="blue" onClick={() => setReportOpened(true)}>
                <IconFileDescription size={18} />
              </ActionIcon>
            </Tooltip>

            <Button leftIcon={<IconWriting />} onClick={addHandler}>
              <span className="hidden lg:inline-block">Agregar Transacción</span>
              <span className="lg:hidden">Agregar</span>
            </Button>
          </div>
        </footer>
      </div>

      <TransactionReport
        dates={rangeDate}
        transactions={transactions}
        opened={reportOpened}
        setOpened={setReportOpened}
      />
    </>
  );
};

export default BoxShow;
