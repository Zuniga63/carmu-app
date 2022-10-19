import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Modal, Select, TextInput } from '@mantine/core';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { IconCalendar, IconFileInvoice, IconHome, IconPhone } from '@tabler/icons';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import InvoiceFormHeader from './InvoiceFormHeader';
import InvoiceFormGroup from './InvoiceFormGroup';
import InvoiceFormNewItem from './InvoiceFormNewItem';
import InvoiceFormItemList from './InvoiceFormItemList';
import { IInvoiceSummary, INewInvoiceItem, INewInvoicePayment } from 'types';
import InvoiceFormPayment from './InvoiceFormPayment';
import InvoiceFormPaymentList from './InvoiceFormPaymentList';
import { closeNewInvoiceForm } from 'store/reducers/InvoicePage/creators';

const InvoiceForm = () => {
  const { formOpened: opened, customers } = useAppSelector(state => state.InvoicePageReducer);
  const dispatch = useAppDispatch();

  // CUSTOMER
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [documentType, setDocumentType] = useState<string | null>('CC');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // FACTURATION
  const [expeditionDate, setExpeditionDate] = useState<Date | null>(dayjs().toDate());
  const [expirationDate, setExpirationDate] = useState<Date | null>(dayjs().add(1, 'month').toDate());
  const [isSeparate, setIsSeparate] = useState(false);

  // ITEMS
  const [items, setItems] = useState<INewInvoiceItem[]>([]);
  const [cashPayments, setCashPayments] = useState<INewInvoicePayment[]>([]);

  // RESUME
  const [summary, setSummary] = useState<IInvoiceSummary>({
    subtotal: 0,
    discount: undefined,
    amount: 0,
    cash: undefined,
    cashChange: undefined,
    balance: undefined,
  });

  // --------------------------------------------------------------------------
  // METHODS
  // --------------------------------------------------------------------------

  const addItem = (newItem: INewInvoiceItem) => {
    // Verify if exist other item with this characteristics
    const equalItem = items.find(item => {
      let isEqual = true;
      if (item.categories.length !== newItem.categories.length) isEqual = false;
      else if (item.product !== newItem.product) isEqual = false;
      else if (item.productColor !== newItem.productColor) isEqual = false;
      else if (item.productSize !== newItem.productSize) isEqual = false;
      else if (item.tags.length !== newItem.tags.length) isEqual = false;
      else if (item.description !== newItem.description) isEqual = false;
      else if (item.unitValue !== newItem.unitValue) isEqual = false;
      else if (item.discount !== newItem.discount) isEqual = false;

      // Verify categories
      if (isEqual && item.categories.length > 0) {
        newItem.categories.forEach(category => {
          const exist = item.categories.some(ctg => ctg === category);
          if (!exist) isEqual = false;
        });
      }

      // Verify tags
      if (isEqual && item.tags.length > 0) {
        newItem.tags.forEach(tag => {
          const exist = item.tags.some(tg => tg === tag);
          if (!exist) isEqual = false;
        });
      }

      return isEqual;
    });

    if (equalItem) {
      const index = items.findIndex(item => item.id === equalItem.id);
      equalItem.quantity += newItem.quantity;
      equalItem.amount += newItem.amount;

      setItems(current => {
        const list = current.slice();
        list.splice(index, 1, equalItem);
        return list;
      });
    } else {
      setItems(current => [...current, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    const list = items.filter(item => item.id !== itemId);
    setItems(list);
  };

  const addPayment = (newPayment: INewInvoicePayment) => {
    const result = cashPayments.slice();
    console.log(newPayment);

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

    setCashPayments(result);
  };

  const removePayment = (paymentId: number) => {
    setCashPayments(current => {
      return current.filter(item => item.id !== paymentId);
    });
  };

  const closeInvoice = () => {
    dispatch(closeNewInvoiceForm());
  };

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setCustomerName(customer.fullName);
        setDocumentType(current => customer.documentType || current);
        setDocument(current => customer.documentNumber || current);
        setAddress(current => customer.address || current);
        setPhone(current => (customer.contacts.length ? customer.contacts[0].phone : current));
      }
    } else {
      setCustomerName('');
      setDocument('');
      setDocumentType('CC');
      setAddress('');
      setPhone('');
    }
  }, [customerId]);

  useEffect(() => {
    if (expeditionDate) {
      setExpirationDate(dayjs(expeditionDate).add(1, 'month').toDate());
    } else {
      setExpirationDate(null);
    }
  }, [expeditionDate]);

  useEffect(() => {
    let subtotal = 0,
      discount = 0,
      amount = 0,
      balance = 0,
      cash = 0,
      cashChange = 0;

    items.forEach(item => {
      subtotal += item.quantity * item.unitValue;
      if (item.discount) discount += item.quantity * item.discount;
    });

    amount += subtotal - discount;
    balance = amount;
    cash = cashPayments.reduce((prevValue, currentPayment) => prevValue + currentPayment.amount, 0);

    if (cash < balance) balance -= cash;
    else {
      cashChange = cash - balance;
      balance = 0;
    }
    setSummary({
      subtotal,
      discount: discount || undefined,
      amount,
      cash: cash || undefined,
      cashChange: cashChange || undefined,
      balance: balance || undefined,
    });
  }, [items, cashPayments]);

  return (
    <Modal opened={opened} size="80%" padding={0} withCloseButton={false} onClose={closeInvoice}>
      <InvoiceFormHeader onClose={closeInvoice} isSeparate={isSeparate} />
      <div className="px-6 py-2">
        {/* CUSTOMER && DATE */}
        <div className="mb-6 grid grid-cols-12 gap-x-4">
          {/* CUSTOMER */}
          <InvoiceFormGroup title="Cliente" className="col-span-9">
            <div className="grid grid-cols-2 gap-2">
              {/* SELECT CUSTOMER */}
              <Select
                className="col-span-2"
                value={customerId}
                onChange={value => setCustomerId(value)}
                data={customers.map(customer => ({ value: customer.id, label: customer.fullName }))}
                size="xs"
                placeholder="Selecciona un cliente"
                searchable
                clearable
              />

              {/* Full Name */}
              <TextInput
                label="Nombre completo"
                value={customerName}
                placeholder="Nombre completo del cliente"
                size="xs"
                onChange={({ target }) => setCustomerName(target.value)}
              />

              {/* Document */}
              <div className="grid grid-cols-12 gap-2">
                <TextInput
                  label="Documento"
                  className="col-span-9"
                  value={document}
                  placeholder="Escribelo aquí"
                  size="xs"
                  onChange={({ target }) => setDocument(target.value)}
                />
                <Select
                  className="col-span-3"
                  label="Tipo"
                  value={documentType}
                  onChange={value => setDocumentType(value)}
                  data={['CC', 'TI', 'NIT', 'PAP']}
                  size="xs"
                  allowDeselect={false}
                />
              </div>

              {/* ADDRESS */}
              <TextInput
                placeholder="Dirección del cliente"
                size="xs"
                icon={<IconHome size={15} />}
                value={address}
                onChange={({ target }) => setAddress(target.value)}
              />
              <TextInput
                placeholder="Telefono de contacto"
                size="xs"
                icon={<IconPhone size={15} />}
                value={phone}
                onChange={({ target }) => setPhone(target.value)}
                type="tel"
              />
            </div>
          </InvoiceFormGroup>

          {/* DATES */}
          <InvoiceFormGroup title="Facturación" className="col-span-3">
            {/* Expedition Date */}
            <DatePicker
              label="Fecha de expedición"
              locale="es-do"
              icon={<IconCalendar size={14} />}
              placeholder="Selecciona una fecha"
              value={expeditionDate}
              onChange={value => setExpeditionDate(value)}
              maxDate={dayjs().toDate()}
              clearable
              className="mb-2"
              size="xs"
              dropdownType="modal"
            />

            {/* EXPIRATION DATE */}
            <DatePicker
              label="Fecha de vencimiento"
              className="mb-2"
              locale="es-do"
              icon={<IconCalendar size={14} />}
              placeholder="Selecciona una fecha"
              value={expirationDate}
              onChange={value => setExpirationDate(value)}
              minDate={dayjs(expeditionDate).toDate()}
              clearable
              size="xs"
              disabled={!expeditionDate}
              dropdownType="modal"
            />

            <Checkbox
              label="¿Es un apartado?"
              checked={isSeparate}
              onChange={({ currentTarget }) => setIsSeparate(currentTarget.checked)}
              size="xs"
            />
          </InvoiceFormGroup>
        </div>
        {/* ADD ITEM */}
        <div className="mb-6">
          <InvoiceFormNewItem addItem={addItem} />
        </div>
        {/* ADD PAYMENT */}
        <div className="mb-6">
          <InvoiceFormPayment invoiceDate={expeditionDate} addPayment={addPayment} />
        </div>
        {/* ITEM LIST AND PAYMENTS */}
        <div className="mb-6 grid grid-cols-3 items-start gap-x-4">
          {/* ITEM LIST */}
          <div className="col-span-2">
            <InvoiceFormItemList items={items} removeItem={removeItem} summary={summary} />
          </div>
          {/* Payments */}
          <div>
            <InvoiceFormPaymentList payments={cashPayments} removePayment={removePayment} summary={summary} />
          </div>
        </div>
      </div>
      <footer className="flex justify-end px-6 py-4">
        <Button size="md" leftIcon={<IconFileInvoice size={18} />}>
          {isSeparate ? 'Apartar' : 'Facturar'}
        </Button>
      </footer>
    </Modal>
  );
};

export default InvoiceForm;
