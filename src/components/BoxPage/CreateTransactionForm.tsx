import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Checkbox, Modal, NumberInput, Textarea } from '@mantine/core';
import { IconCalendar, IconClock, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IValidationErrors } from 'src/types';
import { currencyFormat } from 'src/utils';
import { DatePicker, TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { boxPageSelector, hideTransactionForm, storeTransaction } from 'src/features/BoxPage';

const CreateTransactionForm = () => {
  const [date, setDate] = useState<Date | undefined | null>(undefined);
  const [time, setTime] = useState<Date | null | undefined>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [isExpense, setIsExpense] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const {
    boxSelected: box,
    mainBox,
    showingMainBox,
    storeTransactionFormOpened: opened,
    storeTransactionIsSuccess: isSuccess,
    storeTransactionError: error,
    storeTransactionLoading: loading,
  } = useAppSelector(boxPageSelector);
  const dispatch = useAppDispatch();

  const [balance, setBalance] = useState(0);

  const closeHandler = () => {
    if (!loading) {
      setDescription('');
      setAmount(undefined);
      setIsExpense(false);
      setErrors(null);
      dispatch(hideTransactionForm());
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    if (amount && description) {
      const data = {
        description,
        amount: isExpense ? amount * -1 : amount,
        date: transactionDate ? transactionDate : undefined,
      };

      if (box || mainBox) dispatch(storeTransaction({ boxId: box?.id, ...data }));
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
    if (isSuccess) {
      toast.success(`¡Transacción Registrada!`);
      closeHandler();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        const data = response?.data;

        if (data) {
          if (response.status === 422 && data.validationErrors) {
            setErrors(data.validationErrors);
          } else if (response.status === 401) {
            toast.error(response.data.message);
          } else {
            console.log(error);
          }
        }
      } else {
        console.log(error);
      }
    }
  }, [error]);

  useEffect(() => {
    if (amount && description && amount > 0) setEnabled(true);
    else setEnabled(false);
  }, [amount, description]);

  useEffect(() => {
    if (showingMainBox && mainBox?.balance) setBalance(mainBox.balance);
    else if (box?.balance) setBalance(box.balance);
    else setBalance(0);
  }, [showingMainBox, box?.balance, mainBox?.balance]);

  return (
    <Modal opened={opened} onClose={closeHandler} size="sm" padding={0} withCloseButton={false}>
      <form onSubmit={submitHandler} className="px-4 py-6">
        <header className="mb-4 border-b-2 pb-2 text-center">
          <h2 className="text-center text-xl font-bold"> Registrar Transacción</h2>
          <p className="text-xs">
            {box?.name || mainBox?.name} ({currencyFormat(balance)})
          </p>
        </header>
        <div className="mb-4 py-4">
          {/* DATE AND TIME */}
          <div className="gap-x-2 md:mb-2 md:grid md:grid-cols-5">
            {/* Date */}
            <DatePicker
              label="Fecha"
              locale="es-do"
              placeholder="Selecciona una fecha"
              value={date}
              onChange={setDate}
              minDate={box?.openBox ? dayjs(box?.openBox).toDate() : undefined}
              maxDate={dayjs().toDate()}
              className="mb-2 md:col-span-3 md:mb-0"
              icon={<IconCalendar size={16} />}
              error={errors?.transactionDate.message}
            />
            {/* Time */}
            <TimeInput
              label="Hora"
              placeholder="Ingresala aquí."
              value={time}
              onChange={setTime}
              className="mb-2 md:col-span-2 md:mb-0"
              icon={<IconClock size={16} />}
              format="12"
              clearable
            />
          </div>

          {/* Description */}
          <Textarea
            label="Descripción"
            required
            placeholder="Describe el movimiento aquí."
            className="mb-2"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            error={errors?.description.message}
          />

          {/* Amount */}
          <NumberInput
            label="Importe"
            required
            placeholder="Escribe el importe aquí."
            className="mb-4"
            hideControls
            min={0}
            step={100}
            value={amount}
            onChange={value => setAmount(value)}
            onFocus={({ target }) => target.select()}
            error={errors?.cash?.message}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={formater}
          />
          {/* Check */}
          <Checkbox
            label="Es un egreso."
            checked={isExpense}
            onChange={({ currentTarget }) => setIsExpense(currentTarget.checked)}
          />
        </div>
        <footer className="flex items-center justify-between">
          <Button
            leftIcon={<IconX size={14} stroke={4} />}
            color="red"
            type="button"
            disabled={loading}
            size="xs"
            onClick={closeHandler}
          >
            Cancelar
          </Button>

          <Button
            leftIcon={<IconDeviceFloppy size={14} stroke={2} />}
            loading={loading}
            type="submit"
            disabled={!enabled}
            size="xs"
          >
            Guardar
          </Button>
        </footer>
      </form>
    </Modal>
  );
  return <div>CreateTransactionForm</div>;
};

export default CreateTransactionForm;
