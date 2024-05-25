import { format } from 'date-fns';
import { IconCalendar, IconFileDescription } from '@tabler/icons-react';

import { Button } from '../ui/Button';
import WaitingBox from './WaitingBox';
import { Calendar } from '../ui/Calendar';
import { ScrollArea } from '../ui/ScrollArea';
import { cn, currencyFormat } from '@/lib/utils';
import TransactionTable from './TransactionTable';
import TransactionReport from './TransactionReport';
import { useBoxShow } from '@/hooks/boxes-page/use-box-show';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';

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
            <div className={cn('grid gap-2')}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(' justify-start text-left font-normal', !rangeDate && 'text-muted-foreground')}
                  >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    {rangeDate?.from ? (
                      rangeDate.to ? (
                        <>
                          {format(rangeDate.from, 'LLL dd, y')} - {format(rangeDate.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(rangeDate.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-fixed w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={rangeDate?.from}
                    selected={rangeDate}
                    onSelect={setRangeDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : null}
        </header>
        <ScrollArea className="relative h-[23rem] border border-y-0 border-x-gray-400 dark:border-x-header 3xl:h-[40rem]">
          <TransactionTable transactions={transactions} />
        </ScrollArea>
        <footer className="flex items-center justify-between rounded-b-md bg-gray-300 px-6 py-2 dark:bg-header">
          <div className="flex flex-col items-center gap-y-1 lg:flex-row lg:gap-x-2">
            <span className="text-xs lg:text-base">Saldo:</span>
            <span className="text-center text-xs font-bold lg:text-base">{currencyFormat(balance)}</span>
          </div>

          <div className="hidden lg:block">Registros: {transactions.length}</div>

          <div className="flex items-center gap-x-4">
            <Button size={'icon'} className="h-8 w-8" onClick={() => setReportOpened(true)}>
              <IconFileDescription size={18} />
            </Button>

            <Button onClick={addHandler}>
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
