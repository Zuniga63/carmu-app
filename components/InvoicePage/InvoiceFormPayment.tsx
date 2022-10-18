import { Checkbox, NumberInput, Select } from '@mantine/core';
import { IconBox, IconPlus } from '@tabler/icons';
import dayjs from 'dayjs';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { IInvoiceCashbox, INewInvoicePayment } from 'types';
import InvoiceFormGroup from './InvoiceFormGroup';

interface Props {
  invoiceDate: Date | null;
  addPayment(newPayment: INewInvoicePayment): void;
}

const InvoiceFormPayment = ({ invoiceDate, addPayment }: Props) => {
  const { cashboxs } = useAppSelector(state => state.InvoicePageReducer);
  const input = useRef<HTMLInputElement>(null);

  const [boxList, setBoxList] = useState<IInvoiceCashbox[]>([]);
  const [boxId, setBoxId] = useState<string | null>(null);
  const [register, setRegister] = useState(true);
  const [description, setDescription] = useState<string | null>('Efectivo');
  const [amount, setAmount] = useState<number | undefined>(undefined);

  const formater = (value: string | undefined) => {
    let result = '';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  const add = () => {
    if (description && amount) {
      const box = boxList.find(item => item.id === boxId);
      const payment: INewInvoicePayment = {
        id: new Date().getTime(),
        box,
        register: Boolean(box) || register,
        description,
        amount,
      };
      addPayment(payment);
      setBoxId(null);
      setDescription('Efectivo');
      setAmount(undefined);
      input.current?.focus();
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && description && amount) {
      add();
      event.currentTarget.blur();
    }
  };

  useEffect(() => {
    let date = dayjs();
    if (invoiceDate && dayjs(invoiceDate).isValid()) date = dayjs(invoiceDate);
    setBoxList(cashboxs.filter(box => Boolean(box.openBox && dayjs(box.openBox).isBefore(date))));
    setBoxId(null);
  }, [cashboxs.length, invoiceDate]);

  return (
    <InvoiceFormGroup title="Agregar Pago">
      <div className="flex items-center gap-x-4">
        <div className="grid flex-grow grid-cols-3 items-start gap-x-4">
          {/* BOX */}
          <div className="flex flex-col gap-y-2">
            <Select
              placeholder="Selecciona una caja"
              value={boxId}
              onChange={setBoxId}
              icon={<IconBox size={14} />}
              data={boxList.map(box => ({
                value: box.id,
                label: box.name,
              }))}
              searchable
              clearable
              size="xs"
              ref={input}
            />
            {!boxId && (
              <Checkbox
                label={<span className="font-sans text-light">Registrar Transacción</span>}
                size="xs"
                checked={register}
                onChange={({ currentTarget }) => setRegister(currentTarget.checked)}
              />
            )}
          </div>
          {/* DESCRIPTION */}
          <Select
            placeholder="Forma de pago"
            value={description}
            onChange={setDescription}
            icon={<IconBox size={14} />}
            data={['Efectivo', 'Consignación', 'Transferencia']}
            size="xs"
            required
          />
          {/* AMOUNT */}
          <NumberInput
            placeholder="Importe del pago en $"
            hideControls
            size="xs"
            value={amount}
            precision={2}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
            onChange={val => setAmount(val)}
            formatter={formater}
            onFocus={({ target }) => target.select()}
            onKeyDown={handleKeyPress}
          />
        </div>

        <button
          className="rounded-full border border-green-400 border-opacity-50 p-2 text-green-500 transition-colors  hover:border-green-400 hover:text-light active:border-green-800 active:text-green-800 disabled:opacity-20"
          disabled={!(description && amount)}
          onClick={add}
        >
          <IconPlus size={20} stroke={3} />
        </button>
      </div>
    </InvoiceFormGroup>
  );
};

export default InvoiceFormPayment;
