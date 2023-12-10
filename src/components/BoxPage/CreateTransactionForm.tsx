import { FormEvent } from 'react';
import { Button, Checkbox, Modal, NumberInput, Textarea } from '@mantine/core';
import { IconCalendar, IconClock, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { currencyFormat } from '@/utils';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useCreateTransactionForm } from '@/hooks/boxes-page/use-create-transaction-form';

const CreateTransactionForm = () => {
  const { form, errors, isLoading, balance, cashbox, mainBox, closeForm, resetData, submitTransaction } =
    useCreateTransactionForm();

  const handleClose = () => {
    if (isLoading) return;

    resetData();
    closeForm();
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitTransaction();
  };

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  return (
    <Modal opened={form.isOpen} onClose={handleClose} size="sm" padding={0} withCloseButton={false}>
      <form onSubmit={submitHandler} className="px-4 py-6">
        <header className="mb-4 border-b-2 pb-2 text-center">
          <h2 className="text-center text-xl font-bold"> Registrar Transacción</h2>
          <p className="text-xs">
            {cashbox?.name || mainBox?.name} ({currencyFormat(balance)})
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
              value={form.date.value}
              onChange={form.date.onChange}
              minDate={form.date.min}
              maxDate={form.date.max}
              className="mb-2 md:col-span-3 md:mb-0"
              icon={<IconCalendar size={16} />}
              error={errors?.transactionDate.message}
            />
            {/* Time */}
            <TimeInput
              label="Hora"
              value={form.time.value}
              onChange={form.time.onChange}
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
            value={form.description.value}
            onChange={({ target }) => form.description.onChange(target.value)}
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
            value={form.amount.value}
            onChange={value => form.amount.onChange(value)}
            onFocus={({ target }) => target.select()}
            error={errors?.cash?.message}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={formater}
          />
          {/* Check */}
          <Checkbox
            label="Es un egreso."
            checked={form.isExpense.value}
            onChange={({ currentTarget }) => form.isExpense.onChange(currentTarget.checked)}
          />
        </div>
        <footer className="flex items-center justify-between">
          <Button
            leftIcon={<IconX size={14} stroke={4} />}
            color="red"
            type="button"
            disabled={isLoading}
            size="xs"
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            leftIcon={<IconDeviceFloppy size={14} stroke={2} />}
            loading={isLoading}
            type="submit"
            disabled={!form.isEnabled || isLoading}
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
