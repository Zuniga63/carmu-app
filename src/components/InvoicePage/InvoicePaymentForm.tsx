import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';
import { currencyFormat } from '@/lib/utils';
import { useCreateInvoicePayment } from '@/hooks/react-query/invoices.hooks';
import { FormEvent, useEffect, useState } from 'react';
import type { IBox, IInvoiceFull, IInvoicePaymentData, IValidationErrors } from '@/types';

import { Button, Checkbox, Modal, NumberInput, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconBox, IconCalendar, IconCash } from '@tabler/icons-react';

type Props = {
  isOpen: boolean;
  invoice?: IInvoiceFull;
  onClose: () => void;
};

const InvoicePaymentForm = ({ isOpen, invoice, onClose }: Props) => {
  const { data: boxesResponse } = useGetAllBoxes();
  const boxes: IBox[] = boxesResponse?.boxes || [];

  const { mutate: addPayment, data, isSuccess, isPending, error } = useCreateInvoicePayment();

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
    if (isPending) return;
    onClose();
    resetForm();
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
      addPayment(data);
      // dispatch(registerPayment(data));
    } else {
      toast.error('¡Hacen falta datos!');
    }
  };

  useEffect(() => {
    if (!invoice) closeForm();
  }, [invoice]);

  useEffect(() => {
    if (!error) return;

    if (error instanceof AxiosError) {
      const { response } = error;
      const data = response?.data;

      if (!data) return;

      if (response.status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (response.status === 401) {
        toast.error(response.data.message);
      } else {
        console.log(error);
      }
    } else {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.success(data.message);
    closeForm();
  }, [isSuccess]);

  return (
    <Modal
      opened={isOpen}
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
          <Button leftIcon={<IconCash size={16} />} type="submit" loading={isPending}>
            Registrar
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default InvoicePaymentForm;
