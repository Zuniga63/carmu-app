import { Button, Checkbox, NumberInput, Select } from '@mantine/core';
import { IconBox, IconCirclePlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { IBox, IInvoiceCashbox, IInvoiceSummary, INewInvoicePayment } from '@/types';
import InvoiceFormGroup from './InvoiceFormGroup';
import InvoiceFormPaymentList from './InvoiceFormPaymentList';
import { useConfigStore } from '@/store/config-store';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';

interface Props {
  invoiceDate: Date | null;
  summary: IInvoiceSummary;
  payments: INewInvoicePayment[];
  setPayments: React.Dispatch<React.SetStateAction<INewInvoicePayment[]>>;
}

const InvoiceFormPayment: React.FC<Props> = ({ invoiceDate, summary, payments, setPayments }) => {
  const commercialPremise = useConfigStore(state => state.premiseStore);
  const input = useRef<HTMLInputElement>(null);

  const { data: boxesResponse } = useGetAllBoxes();
  const boxes: IBox[] = boxesResponse?.boxes || [];

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

  const addPayment = (newPayment: INewInvoicePayment) => {
    const result = payments.slice();

    const equalPayment = result.find(payment => {
      let isEqual = true;
      if (Boolean(payment.box) !== Boolean(newPayment.box)) isEqual = false;
      else if (payment.box && newPayment.box && payment.box.id !== newPayment.box.id) isEqual = false;
      else if (payment.description !== newPayment.description) isEqual = false;
      else if (payment.register !== newPayment.register) isEqual = false;

      return isEqual;
    });

    if (!equalPayment) result.push(newPayment);
    else {
      const index = result.findIndex(item => item.id === equalPayment.id);
      equalPayment.amount += newPayment.amount;
      result.splice(index, 1, equalPayment);
    }

    setPayments(result);
  };

  const removePayment = (paymentId: number) => {
    setPayments(current => {
      return current.filter(item => item.id !== paymentId);
    });
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
    setBoxList(boxes.filter(box => Boolean(box.openBox && dayjs(box.openBox).isBefore(date))));
    setBoxId(null);
  }, [boxes.length, invoiceDate]);

  useEffect(() => {
    if (summary.balance && summary.balance > 0) {
      setAmount(summary.balance);
    }
  }, [summary.balance]);

  useEffect(() => {
    if (commercialPremise) {
      const { defaultBox } = commercialPremise;
      const id = defaultBox && defaultBox.openBox && dayjs().isAfter(defaultBox.openBox) ? defaultBox.id : null;

      setBoxId(id);
    }
  }, [commercialPremise]);

  return (
    <div className="grid grid-cols-3 items-start gap-x-4 pt-4">
      <InvoiceFormGroup title="Registrar Pago">
        {/* BOX */}
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
          className="mb-4"
        />

        {/* DESCRIPTION */}
        <Select
          placeholder="Forma de pago"
          value={description}
          onChange={setDescription}
          icon={<IconBox size={14} />}
          data={['Efectivo', 'Consignación', 'Transferencia']}
          size="xs"
          required
          className="mb-4"
        />

        <NumberInput
          placeholder="Importe del pago en $"
          hideControls
          size="xs"
          value={amount}
          parser={value => value?.replace(/\$\s?|(,*)/g, '')}
          onChange={val => setAmount(val)}
          formatter={formater}
          onFocus={({ target }) => target.select()}
          onKeyDown={handleKeyPress}
        />

        {!boxId && (
          <Checkbox
            label={<span className="font-sans">Registrar Transacción</span>}
            size="xs"
            checked={register}
            onChange={({ currentTarget }) => setRegister(currentTarget.checked)}
            onKeyDown={handleKeyPress}
            className="mt-2"
          />
        )}

        <div className="mt-8 flex justify-end">
          <Button leftIcon={<IconCirclePlus size={20} />} onClick={add}>
            Agregar
          </Button>
        </div>
      </InvoiceFormGroup>

      <div className="col-span-2">
        <InvoiceFormPaymentList payments={payments} removePayment={removePayment} summary={summary} />
      </div>
    </div>
  );
};

export default InvoiceFormPayment;
