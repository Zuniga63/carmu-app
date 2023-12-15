import { Button, Checkbox, Modal, NumberInput, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconBox, IconCalendar, IconCash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { FormEvent } from 'react';

import { currencyFormat } from '@/lib/utils';
import { useCustomerPaymentModal } from '@/hooks/customer-page/use-customer-payment-modal';

const CustomerPaymentModal = () => {
  const {
    form,
    errors,
    payment,
    customer,
    boxes,
    updateBox,
    updateDescription,
    updateAmount,
    updatePaymentDate,
    updateRegister,
  } = useCustomerPaymentModal();

  const formater = (value: string | undefined) => {
    let result = '';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.submit();
  };

  return (
    <Modal
      opened={form.isOpen}
      onClose={form.close}
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
              value={payment.boxId}
              onChange={updateBox}
              icon={<IconBox size={14} />}
              data={boxes}
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
            value={payment.paymentDate}
            onChange={value => updatePaymentDate(value)}
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
            value={payment.description}
            onChange={updateDescription}
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
            value={payment.amount}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
            onChange={val => updateAmount(val)}
            formatter={formater}
            onFocus={({ target }) => target.select()}
            error={errors?.amount?.message}
          />
          {!payment.boxId && (
            <Checkbox
              className="mt-2"
              label={<span className="font-sans text-light">Registrar Transacción</span>}
              size="xs"
              checked={payment.register}
              onChange={({ currentTarget }) => updateRegister(currentTarget.checked)}
            />
          )}
        </div>
        <footer className="flex justify-end">
          <Button leftIcon={<IconCash size={16} />} type="submit" loading={form.isLoading}>
            Registrar
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default CustomerPaymentModal;
