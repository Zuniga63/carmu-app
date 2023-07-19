import { Button, Checkbox, Modal, NumberInput, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconBox, IconCalendar, IconCash } from '@tabler/icons';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { boxPageSelector } from 'src/features/BoxPage';
import { hidePaymentForm, invoicePageSelector, registerPayment } from 'src/features/InvoicePage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IInvoicePaymentData, IValidationErrors } from 'src/types';
import { currencyFormat } from 'src/utils';

const InvoicePaymentForm = () => {
  const {
    paymentFormOpened: opened,
    selectedInvoice: invoice,
    storePaymentLoading: loading,
    storePaymentError: error,
    storePaymentSuccess: success,
  } = useAppSelector(invoicePageSelector);

  const { boxes } = useAppSelector(boxPageSelector);

  const dispatch = useAppDispatch();
  const defaultDescription = 'Efectivo';

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
      dispatch(hidePaymentForm());
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
    let date = dayjs(paymentDate);
    if (date.isValid() && invoice && date.isBefore(invoice?.expeditionDate)) date = dayjs(invoice?.expeditionDate);
    return {
      invoiceId: invoice?.id || '',
      cashboxId: boxId || undefined,
      paymentDate: date.toDate(),
      description: description || 'Efectivo',
      amount: amount || 0,
      register: boxId ? true : register,
    };
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (description && amount && amount > 0 && invoice && paymentDate) {
      const data = getData();
      dispatch(registerPayment(data));
    } else {
      toast.error('¡Hacen falta datos!');
    }
  };

  useEffect(() => {
    if (!invoice) closeForm();
  }, [invoice]);

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
    } else {
      setErrors(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(hidePaymentForm());
      resetForm();
    }
  }, [success]);

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
            Factura N° <span className="font-bold text-red-500">{invoice?.prefixNumber}</span>
          </h3>
          <p className="text-xs text-gray-500">
            Saldo: <span className="ml-1 inline-block font-bold text-light">{currencyFormat(invoice?.balance)}</span>
          </p>
        </header>
        <div className="mb-4">
          {/* BOX */}
          <div className="mb-2 flex flex-col gap-y-2">
            <Select
              placeholder="Selecciona una caja"
              value={boxId}
              onChange={setBoxId}
              icon={<IconBox size={14} />}
              data={boxes.map(box => ({
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
            minDate={dayjs(invoice?.expeditionDate).toDate()}
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
            precision={2}
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

export default InvoicePaymentForm;
