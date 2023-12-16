import { type SelectItem } from '@mantine/core';

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import type { ICustomer, IInvoicePaymentData, IValidationErrors } from '@/types';
import { currencyFormat } from '@/lib/utils';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';
import { useCustomerPageStore } from '@/store/customer-store';
import { useAddCustomerPayment, useGetAllCustomers } from '@/hooks/react-query/customers.hooks';
import axios from 'axios';

export function useCustomerPaymentModal() {
  const defaultDescription = 'Efectivo';

  const customerId = useCustomerPageStore(state => state.customerToPayment);
  const unmountCustomer = useCustomerPageStore(state => state.unmountCustomerToPayment);

  const { data: boxesData } = useGetAllBoxes();
  const { data: customers = [] } = useGetAllCustomers();

  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [boxId, setBoxId] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(dayjs().toDate());
  const [register, setRegister] = useState(true);
  const [description, setDescription] = useState<string | null>(defaultDescription);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const boxes: SelectItem[] = useMemo(() => {
    if (!boxesData?.boxes) return [];
    return boxesData.boxes.filter(b => Boolean(b.openBox)).map(box => ({ value: box.id, label: box.name }));
  }, [boxesData]);

  const { mutate: addPayment, isError, isSuccess, isPending, error, reset: resetQuery } = useAddCustomerPayment();

  const resetForm = () => {
    setBoxId(null);
    setRegister(true);
    setDescription(defaultDescription);
    setAmount(undefined);
  };

  const getData = (): IInvoicePaymentData => {
    const date = dayjs(paymentDate);

    return {
      invoiceId: '',
      cashboxId: boxId || undefined,
      paymentDate: date.toDate(),
      description: description || 'Efectivo',
      amount: amount || 0,
      register: boxId ? true : register,
    };
  };

  const sumbitPayment = () => {
    const isValid = description && amount && amount > 0 && customerId && paymentDate;

    if (isValid) {
      const data = getData();
      addPayment({ customerId, data });
    } else {
      toast.error('¡Hacen falta datos!');
    }
  };

  const closeForm = () => {
    if (isPending) return;

    setIsOpen(false);
    resetQuery();
    setTimeout(() => {
      resetForm();
      unmountCustomer();
    }, 250);
  };

  useEffect(() => {
    const customer = customers.find(({ id }) => id === customerId);
    if (!customer) {
      setIsOpen(false);
      setCustomer(null);
    } else {
      setIsOpen(true);
      setCustomer(customer);
    }
  }, [customerId]);

  useEffect(() => {
    if (!error || !isError) return;

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
  }, [error, isError]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.success(
      `El pago por valor de ${currencyFormat(amount)} al cliente ${customer?.fullName} fue registrado con éxito.`,
    );
    closeForm();
  }, [isSuccess]);

  return {
    customer,
    boxes,
    payment: {
      boxId,
      paymentDate,
      register,
      description,
      amount,
    },
    form: {
      isOpen,
      isLoading: isPending,
      reset: resetForm,
      close: closeForm,
      submit: sumbitPayment,
    },
    errors,
    updateBox: setBoxId,
    updatePaymentDate: setPaymentDate,
    updateRegister: setRegister,
    updateDescription: setDescription,
    updateAmount: setAmount,
  };
}
