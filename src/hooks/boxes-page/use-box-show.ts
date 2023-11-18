import { DateRangePickerValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { IBox, ITransaction, ITransactionResponse } from '@/types';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { useGetAllBoxes, useGetMainTransactions, useGetMinorTransactions } from '@/hooks/react-query/boxes.hooks';

export function useBoxShow() {
  const boxSelectedId = useBoxesPageStore(state => state.boxToInfo);
  const mainBoxIsSelected = useBoxesPageStore(state => state.mainBoxIsSelected);
  const infoIsOpen = useBoxesPageStore(state => state.infoIsOpen);
  const unMountBox = useBoxesPageStore(state => state.unmountBoxToInfo);
  const showTransactionForm = useBoxesPageStore(state => state.showTransactionForm);

  const [waiting, setWaiting] = useState(true);
  const [cashbox, setCashbox] = useState<IBox | null>(null);
  const [rangeDate, setRangeDate] = useState<DateRangePickerValue>([null, null]);
  const [reportOpened, setReportOpened] = useState(false);

  const { data: boxData } = useGetAllBoxes();

  const mappedTransactions = (base = 0, dataList: ITransactionResponse[]) => {
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

  const resetComponent = () => {
    setWaiting(true);
    setCashbox(null);
    setRangeDate([null, null]);
  };

  const {
    data: boxTransactions,
    isLoading: minorIsLoading,
    isSuccess: minorIsSuccess,
    isError: minorIsError,
  } = useGetMinorTransactions({
    boxId: boxSelectedId,
    enabled: infoIsOpen,
  });

  const {
    data: mainTransactions,
    isLoading: mainIsLoading,
    isSuccess: mainIsSuccess,
    isError: mainIsError,
  } = useGetMainTransactions({
    enabled: infoIsOpen && mainBoxIsSelected,
  });

  const transactions = useMemo(() => {
    const allTransactions = mappedTransactions(
      cashbox?.base,
      (mainBoxIsSelected ? mainTransactions : boxTransactions) || [],
    );

    if (mainBoxIsSelected && rangeDate[0] && rangeDate[1]) {
      return allTransactions.filter(
        t => t.transactionDate.isSameOrAfter(rangeDate[0]) && t.transactionDate.isSameOrBefore(rangeDate[1]),
      );
    } else if (mainBoxIsSelected) {
      return allTransactions.filter(t => t.transactionDate.isSameOrAfter(dayjs().startOf('month')));
    }

    return allTransactions;
  }, [mainTransactions, boxTransactions, rangeDate, cashbox]);

  const balance = useMemo(
    () => transactions.reduce((sum, { amount }) => sum + amount, cashbox?.base || 0),
    [transactions],
  );

  useEffect(() => {
    const boxSelected = boxData?.boxes.find(({ id }) => id === boxSelectedId);
    setCashbox(boxSelected || null);
  }, [boxSelectedId]);

  useEffect(() => {
    const isSuccess = minorIsSuccess || mainIsSuccess;
    if (!isSuccess) return;
    setWaiting(false);
  }, [minorIsSuccess, mainIsSuccess]);

  useEffect(() => {
    const isError = minorIsError || mainIsError;
    if (isError) {
      unMountBox();
      resetComponent();
    }
  }, [minorIsError, mainIsError]);

  return {
    waiting,
    loading: minorIsLoading || mainIsLoading,
    boxName: cashbox?.name || (mainBoxIsSelected && 'Caja Global') || '',
    balance,
    transactions,
    rangeDate,
    reportOpened,
    isMainBox: mainBoxIsSelected,
    setRangeDate,
    setReportOpened,
    showTransactionForm,
  };
}
