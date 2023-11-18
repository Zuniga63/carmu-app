import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IBox, IValidationErrors } from '@/types';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { useCloseCashbox, useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';
import axios from 'axios';

export function useCloseBoxForm() {
  const cashboxId = useBoxesPageStore(state => state.boxToClose);
  const unmountBox = useBoxesPageStore(state => state.unmountBoxToClose);

  const { data } = useGetAllBoxes();

  const [cashboxToClose, setCashboxToClose] = useState<IBox | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cash, setCash] = useState<number | undefined>(undefined);
  const [observation, setObservation] = useState('');
  const [leftover, setLeftover] = useState(0);
  const [missing, setMissign] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const { mutate: closeCashbox, isPending: isLoading, isSuccess, isError, error } = useCloseCashbox();

  const closeHandler = () => {
    if (isLoading) return;

    setCash(undefined);
    setObservation('');
    setErrors(null);
    setIsOpen(false);
    unmountBox();
    setLeftover(0);
    setMissign(0);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cashboxToClose && typeof cash !== 'undefined') {
      const data = { cash, observation };
      closeCashbox({ data, cashboxId: cashboxToClose.id });
    }
  };

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  useEffect(() => {
    const cashbox = data?.boxes.find(({ id }) => id === cashboxId);
    if (!cashbox || (cashbox && cashbox.closed)) return;
    setIsOpen(true);
    setCashboxToClose(cashbox);
  }, [cashboxId]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(`¡Caja cerrada con éxito!`);
      closeHandler();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!isError || !error) return;

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;

      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    } else {
      console.log(error);
    }
  }, [error, isError]);

  useEffect(() => {
    setLeftover(0);
    setMissign(0);

    if (typeof cash !== 'undefined' && cash >= 0 && cashboxToClose && typeof cashboxToClose.balance !== 'undefined') {
      setEnabled(true);

      if (cash > cashboxToClose.balance) setLeftover(cash - cashboxToClose.balance);
      else if (cash < cashboxToClose.balance) setMissign(cashboxToClose.balance - cash);
    } else {
      setEnabled(false);
    }
  }, [cash]);

  return {
    isOpen,
    cash,
    cashboxToClose,
    observation,
    isLoading,
    leftover,
    missing,
    enabled,
    errors,
    closeHandler,
    submitHandler,
    formater,
    setCash,
    setObservation,
  };
}
