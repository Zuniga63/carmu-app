import { Button, Checkbox, Modal, NumberInput, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconBox, IconCalendar, IconCash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { boxPageSelector } from '@/features/BoxPage';
import {
  customerPageSelector,
  fetchCustomers,
  storeCustomerPayment,
  unmountCustomerToPayment,
} from '@/features/CustomerPage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IInvoicePaymentData, IValidationErrors } from '@/types';
import { currencyFormat } from '@/utils';

const CustomerPaymentModal = () => {
  const defaultDescription = 'Efectivo';

  const {
    customerToPayment: customer,
    paymentFormOpened: opened,
    paymentFormLoading: loading,
    paymnerFormError: error,
    paymentFormIsSuccess: isSuccess,
  } = useAppSelector(customerPageSelector);

  const { boxes } = useAppSelector(boxPageSelector);

  const dispatch = useAppDispatch();

  const [boxId, setBoxId] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(dayjs().toDate());
  const [register, setRegister] = useState(true);
  const [description, setDescription] = useState<string | null>(defaultDescription);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const resetForm = () => {
    setBoxId(null);
    setRegister(true);
    setDescription(defaultDescription);
    setAmount(undefined);
  };

  const closeForm = () => {
    if (!loading) {
      dispatch(unmountCustomerToPayment());
      resetForm();
    }
  };

  const formater = (value: string | undefined) => {
    let result = '';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
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

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (description && amount && amount > 0 && customer && paymentDate) {
      const data = getData();
      dispatch(storeCustomerPayment(data));
    } else {
      toast.error('¡Hacen falta datos!');
    }
  };

  useEffect(() => {
    if (opened && (!customer || !customer.balance)) closeForm();
  }, [customer]);

  useEffect(() => {
    if (error) {
      const { data, status } = error;
      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    } else {
      setErrors(null);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `El pago por valor de ${currencyFormat(amount)} al cliente ${customer?.fullName} fue registrado con éxito.`,
      );
      closeForm();
      dispatch(fetchCustomers());
    }
  }, [isSuccess]);

  return (
    <Modal
      opened={opened}
      onClose={closeForm}
      title={<h2 className="font-bold uppercase">Registrar Pago</h2>}
      size="sm"
    >
      <form onSubmit={onSubmitHandler}>
        <header className="mb-4 flex flex-col items-center">
          <h3>
            Cliente <span className="font-bold text-red-500">{customer?.fullName}</span>
          </h3>
          <p className="text-xs text-gray-500">
            Saldo: <span className="ml-1 inline-block font-bold text-light">{currencyFormat(customer?.balance)}</span>
          </p>
        </header>
        <div className="mb-4">
          {/* BOX */}
          <div className="mb-2 flex flex-col gap-y-2">
            <Select
              placeholder="Caja a registrar el abono"
              value={boxId}
              onChange={setBoxId}
              icon={<IconBox size={14} />}
              data={boxes
                .filter(b => Boolean(b.openBox))
                .map(box => ({
                  value: box.id,
                  label: box.name,
                }))}
              searchable
              clearable
              size="xs"
              error={errors?.cashboxId?.message}
            />
          </div>

          {/* DATE */}
          <DatePicker
            label="Fecha de pago"
            locale="es-do"
            required
            icon={<IconCalendar size={14} />}
            placeholder="Selecciona una fecha"
            value={paymentDate}
            onChange={value => setPaymentDate(value)}
            clearable
            className="mb-2"
            size="xs"
            maxDate={dayjs().toDate()}
            error={errors?.paymentDate?.message}
          />

          {/* DESCRIPTION */}
          <Select
            label="Forma de pago"
            placeholder="Forma de pago"
            value={description}
            onChange={setDescription}
            icon={<IconBox size={14} />}
            data={['Efectivo', 'Consignación', 'Transferencia']}
            size="xs"
            required
            className="mb-2"
            error={errors?.description?.message}
          />

          <NumberInput
            label="Cantidad a pagar"
            placeholder="Importe en pesos $COP"
            required
            hideControls
            size="xs"
            value={amount}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
            onChange={val => setAmount(val)}
            formatter={formater}
            onFocus={({ target }) => target.select()}
            error={errors?.amount?.message}
          />
          {!boxId && (
            <Checkbox
              className="mt-2"
              label={<span className="font-sans text-light">Registrar Transacción</span>}
              size="xs"
              checked={register}
              onChange={({ currentTarget }) => setRegister(currentTarget.checked)}
            />
          )}
        </div>
        <footer className="flex justify-end">
          <Button leftIcon={<IconCash size={16} />} type="submit" loading={loading}>
            Registrar
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default CustomerPaymentModal;
