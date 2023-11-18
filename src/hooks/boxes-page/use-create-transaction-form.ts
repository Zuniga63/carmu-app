import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IValidationErrors, StoreTransactionRequest } from '@/types';
import dayjs from 'dayjs';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { useGetAllBoxes, useCreateMainTransaction, useCreateMinorTransaction } from '@/hooks/react-query/boxes.hooks';

export function useCreateTransactionForm() {
  const isOpen = useBoxesPageStore(state => state.transactionFormIsOpen);
  const boxId = useBoxesPageStore(state => state.boxToInfo);
  const isMainBox = useBoxesPageStore(state => state.mainBoxIsSelected);
  const closeForm = useBoxesPageStore(state => state.hideTransactionForm);

  const [date, setDate] = useState<Date | undefined | null>(undefined);
  const [time, setTime] = useState<Date | null | undefined>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [isExpense, setIsExpense] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const { data } = useGetAllBoxes();

  const {
    mutate: createMinorTransaction,
    isSuccess: minorIsSuccess,
    isPending: minorIsPending,
    error: minorError,
    reset: resetMinor,
  } = useCreateMinorTransaction();

  const {
    mutate: createMainTransaction,
    isSuccess: mainIsSuccess,
    isPending: mainIsPending,
    error: mainError,
    reset: resetMain,
  } = useCreateMainTransaction();

  const cashbox = useMemo(() => {
    if (!data) return undefined;
    return data.boxes.find(box => box.id === boxId);
  }, [boxId]);

  const mainBox = useMemo(() => {
    if (!data) return undefined;
    return data.mainBox;
  }, [isMainBox]);

  const balance = useMemo(() => {
    if (!data) return 0;
    const box = data.boxes.find(box => box.id === boxId);

    if (!box) return data.mainBox?.balance || 0;
    else return box.balance || 0;
  }, [boxId, isMainBox]);

  const resetData = () => {
    setDate(undefined);
    setTime(null);
    setDescription('');
    setAmount(undefined);
    setIsExpense(false);
    setErrors(null);
    resetMinor();
    resetMain();
  };

  const getData = (): StoreTransactionRequest | null => {
    if (!amount || !description) return null;

    let transactionDate = null;
    if (date || time) {
      if (date) {
        transactionDate = dayjs(date);
        if (time) {
          transactionDate = transactionDate.hour(time.getHours()).minute(time.getMinutes()).second(0).millisecond(0);
        }
      } else {
        transactionDate = dayjs(time);
      }
    }

    return {
      description,
      amount: isExpense ? amount * -1 : amount,
      date: transactionDate ? transactionDate : undefined,
    };
  };

  const submitTransaction = () => {
    const data = getData();
    if (minorIsPending || mainIsPending || !data) return;

    if (isMainBox) {
      createMainTransaction({ data });
    } else if (boxId) {
      createMinorTransaction({ boxId, data });
    }
  };

  useEffect(() => {
    if (!(minorIsSuccess || mainIsSuccess)) return;

    toast.success(`¡Transacción Registrada!`);
    resetData();
    closeForm();
  }, [minorIsSuccess, mainIsSuccess]);

  useEffect(() => {
    const error = minorError || mainError;
    if (!error) return;

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      }
    } else {
      console.log(error);
    }
  }, [minorError, mainError]);

  return {
    form: {
      isOpen,
      date: {
        value: date,
        onChange: setDate,
        min: cashbox?.openBox ? dayjs(cashbox?.openBox).toDate() : undefined,
        max: dayjs().toDate(),
      },
      time: { value: time, onChange: setTime },
      description: { value: description, onChange: setDescription },
      amount: { value: amount, onChange: setAmount },
      isExpense: { value: isExpense, onChange: setIsExpense },
      isEnabled: Boolean(amount && description && amount > 0),
    },
    cashbox: cashbox,
    mainBox: mainBox,
    errors,
    isLoading: minorIsPending || mainIsPending,
    balance,
    closeForm,
    resetData,
    submitTransaction,
  };
}
