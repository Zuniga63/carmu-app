import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IBox, IValidationErrors } from '@/types';
import { currencyFormat } from '@/utils';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { useGetAllBoxes, useOpenBox } from '@/hooks/react-query/boxes.hooks';
import axios from 'axios';

export function useOpenBoxForm() {
  const { data } = useGetAllBoxes();
  const cashboxId = useBoxesPageStore(state => state.boxToOpen);
  const unmountBox = useBoxesPageStore(state => state.unmountBoxToOpen);

  const [isOpen, setIsOpen] = useState(false);
  const [base, setBase] = useState<number | undefined>(undefined);
  const [cashbox, setCashbox] = useState<IBox | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const { mutate: openBox, isPending: isLoading, isSuccess, isError, error } = useOpenBox();

  const closeHandler = () => {
    if (isLoading) return;

    setErrors(null);
    setBase(0);
    setIsOpen(false);
    unmountBox();
    // setTimeout(unmountBox, 150);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cashbox && typeof base === 'number' && base >= 0) {
      openBox({ data: { base }, boxId: cashbox.id });
    }
  };

  useEffect(() => {
    const cashboxToOpen = data?.boxes.find(({ id }) => id === cashboxId);
    if (!cashboxToOpen || (cashboxToOpen && cashboxToOpen.openBox)) return;
    setIsOpen(true);
    setCashbox(cashboxToOpen);
  }, [cashboxId]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.success(`Caja abierta con una base de ${currencyFormat(base)}`);
    closeHandler();
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
    if (typeof base === 'number' && base >= 0) setEnabled(true);
    else setEnabled(false);
  }, [base]);

  return { isOpen, base, cashbox, enabled, errors, isLoading, setBase, submitHandler, closeHandler };
}
