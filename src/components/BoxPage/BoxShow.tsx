import { ActionIcon, Button, ScrollArea, Tooltip } from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { IconFileDescription, IconWriting } from '@tabler/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React, { useEffect, useState } from 'react';
import { boxPageSelector, showTransactionForm } from 'src/features/BoxPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ITransaction, ITransactionResponse } from 'src/types';
import { currencyFormat } from 'src/utils';
import TransactionReport from './TransactionReport';
import TransactionTable from './TransactionTable';
import WaitingBox from './WaitingBox';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const BoxShow = () => {
  const {
    boxSelected,
    mainBox,
    showingMainBox,
    loadingTransactions: loading,
    transactions: transactionsData,
    mountBoxIsSuccess,
  } = useAppSelector(boxPageSelector);
  const dispatch = useAppDispatch();

  const [boxName, setBoxName] = useState('');
  const [boxBalance, setBoxBalance] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    ITransaction[]
  >([]);
  const [rangeDate, setRangeDate] = useState<DateRangePickerValue>([
    null,
    null,
  ]);
  const [reportOpened, setReportOpened] = useState(false);

  const addHandler = () => dispatch(showTransactionForm());

  const transformTransactions = (
    base = 0,
    dataList: ITransactionResponse[]
  ) => {
    let balance = base;
    const result: ITransaction[] = [];
    dataList.forEach(item => {
      balance += item.amount;
      result.push({
        ...item,
        transactionDate: dayjs(item.transactionDate),
        balance,
        createdAt: dayjs(item.createdAt),
        updatedAt: dayjs(item.updatedAt),
      });
    });

    return result.reverse();
  };

  useEffect(() => {
    let name = '';
    let boxBalance = 0;
    let base = 0;
    let transactionList: ITransaction[] = [];

    if (mountBoxIsSuccess) {
      if (showingMainBox && mainBox) {
        name = mainBox.name;
        boxBalance = mainBox.balance;
      } else if (boxSelected) {
        name = boxSelected.name;
        boxBalance = boxSelected.balance || 0;
        base = boxSelected.base;
      }
      transactionList = transformTransactions(base, transactionsData);
    }

    setBoxName(name);
    setBoxBalance(boxBalance);
    setTransactions(transactionList);
    setRangeDate([null, null]);

    if (showingMainBox && mainBox) {
      const fromDate = dayjs().startOf('month');

      setFilteredTransactions(
        transactionList.filter(t => t.transactionDate.isSameOrAfter(fromDate))
      );
    } else {
      setFilteredTransactions(transactionList);
    }
  }, [mountBoxIsSuccess, transactionsData]);

  useEffect(() => {
    if (!showingMainBox && !boxSelected) setWaiting(true);
    else setWaiting(false);
  }, [showingMainBox, boxSelected]);

  useEffect(() => {
    if (showingMainBox && rangeDate[0] && rangeDate[1]) {
      setFilteredTransactions(
        transactions.filter(
          t =>
            t.transactionDate.isSameOrAfter(rangeDate[0]) &&
            t.transactionDate.isSameOrBefore(rangeDate[1])
        )
      );
    } else if (showingMainBox && mainBox) {
      setFilteredTransactions(
        transactions.filter(t =>
          t.transactionDate.isSameOrAfter(dayjs().startOf('month'))
        )
      );
    } else {
      setFilteredTransactions(transactions);
    }
  }, rangeDate);

  return (
    <>
      {waiting ? (
        <WaitingBox loading={loading} />
      ) : (
        <div className="w-full">
          <header className="rounded-t-md bg-gray-300 px-6 py-2 dark:bg-header">
            <h2 className="text-center text-xl font-bold tracking-wider">
              {boxName}
            </h2>
            {showingMainBox ? (
              <DateRangePicker
                placeholder="Selecciona una fecha"
                size="xs"
                value={rangeDate}
                onChange={setRangeDate}
                maxDate={dayjs().toDate()}
              />
            ) : null}
          </header>
          <ScrollArea className="relative h-[23rem] overflow-y-auto border border-y-0 border-x-gray-400 dark:border-x-header 3xl:h-[40rem]">
            <TransactionTable transactions={filteredTransactions} />
          </ScrollArea>
          <footer className="flex items-center justify-between rounded-b-md bg-gray-300 px-6 py-2 dark:bg-header">
            <div className="flex flex-col items-center gap-y-1 lg:flex-row lg:gap-x-2">
              <span className="text-xs lg:text-base">Saldo:</span>
              <span className="text-center text-xs font-bold lg:text-base">
                {currencyFormat(boxBalance)}
              </span>
            </div>

            <div className="hidden lg:block">
              Registros: {filteredTransactions.length}
            </div>

            <div className="flex items-center gap-x-4">
              <Tooltip label="Ver informe">
                <ActionIcon color="blue" onClick={() => setReportOpened(true)}>
                  <IconFileDescription size={18} />
                </ActionIcon>
              </Tooltip>

              <Button leftIcon={<IconWriting />} onClick={addHandler}>
                <span className="hidden lg:inline-block">
                  Agregar Transacción
                </span>
                <span className="lg:hidden">Agregar</span>
              </Button>
            </div>
          </footer>
        </div>
      )}

      <TransactionReport
        dates={rangeDate}
        transactions={filteredTransactions}
        opened={reportOpened}
        setOpened={setReportOpened}
      />
    </>
  );
};

export default BoxShow;
