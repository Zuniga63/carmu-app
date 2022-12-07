import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { closeNewInvoiceForm, storeNewInvoice } from 'store/reducers/InvoicePage/creators';

import { DatePicker } from '@mantine/dates';
import { Button, Checkbox, Modal, Select, Tabs, TextInput } from '@mantine/core';
import { IconBox, IconCalendar, IconFileInvoice, IconHome, IconPhone, IconSearch } from '@tabler/icons';

import InvoiceFormHeader from './InvoiceFormHeader';
import InvoiceFormGroup from './InvoiceFormGroup';
import InvoiceFormNewItem from './InvoiceFormNewItem';
import InvoiceFormItemList from './InvoiceFormItemList';
import InvoiceFormPayment from './InvoiceFormPayment';
import InvoiceFormPaymentList from './InvoiceFormPaymentList';
import { IInvoiceStoreData, IInvoiceSummary, INewInvoiceItem, INewInvoicePayment } from 'types';
import { useMediaQuery } from '@mantine/hooks';

const InvoiceForm = () => {
  const {
    formOpened: opened,
    customers,
    storeLoading: loading,
    storeError: error,
    storeSuccess: success,
  } = useAppSelector(state => state.InvoicePageReducer);
  const { user } = useAppSelector(state => state.AuthReducer);
  const dispatch = useAppDispatch();
  const [enabled, setEnabled] = useState(false);
  const largeScreen = useMediaQuery('(min-width: 768px)');

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

  // SUMMARY
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
    if (!loading) {
      dispatch(closeNewInvoiceForm());
    }
  };

  const getData = (): IInvoiceStoreData => {
    return {
      sellerId: user?.id,
      customerId: customerId || undefined,
      isSeparate,
      customerName: customerName || undefined,
      customerAddress: address.trim() || undefined,
      customerDocument: document || undefined,
      customerDocumentType: documentType || undefined,
      customerPhone: phone || undefined,
      sellerName: user?.name,
      expeditionDate: expeditionDate || undefined,
      expirationDate: expirationDate || undefined,
      cash: summary.cash,
      items: items.map(item => ({ ...item, id: undefined, amount: undefined })),
      cashPayments: cashPayments.map(payment => ({
        cashboxId: payment.box?.id,
        description: payment.description,
        amount: payment.amount,
        register: payment.register,
      })),
    };
  };

  const getSumary = (): IInvoiceSummary => {
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

    return {
      subtotal,
      discount: discount || undefined,
      amount,
      cash: cash || undefined,
      cashChange: cashChange || undefined,
      balance: balance || undefined,
    };
  };

  const checkIn = () => {
    if (enabled) {
      const invoiceData = getData();
      dispatch(storeNewInvoice(invoiceData));
    }
  };

  const resetForm = () => {
    setCustomerId(null);
    setIsSeparate(false);
    setItems([]);
    setCashPayments([]);
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
    const summary = getSumary();
    setSummary(summary);
  }, [items, cashPayments]);

  // To determine wheter or not to save the invoice
  useEffect(() => {
    let result = false;
    if (summary.amount > 0 && !summary.balance) result = true;
    else if (summary.balance && ((customerId && customerName) || (customerName && document && documentType))) {
      result = true;
    }
    setEnabled(result);
  }, [customerName, document, documentType, summary.amount, summary.balance]);

  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success('Factura Creada');
      closeInvoice();
      resetForm();
    }
  }, [success]);

  return (
    <Modal
      opened={opened}
      size={largeScreen ? '80%' : '100%'}
      padding={0}
      withCloseButton={false}
      onClose={closeInvoice}
    >
      <InvoiceFormHeader onClose={closeInvoice} isSeparate={isSeparate} />
      <div className="px-6 py-2">
        <Tabs defaultValue="new-customer" className="mb-8">
          <Tabs.List>
            <Tabs.Tab value="new-customer" color="blue" icon={<IconFileInvoice size={14} />}>
              Facturación
            </Tabs.Tab>
            <Tabs.Tab value="new-item" color="blue" icon={<IconBox size={14} />}>
              Items
            </Tabs.Tab>
            <Tabs.Tab value="new-payment" icon={<IconFileInvoice size={14} />}>
              Pagos
            </Tabs.Tab>
          </Tabs.List>

          {/* CUSTOMER && DATE */}
          <Tabs.Panel value="new-customer" pt="lg">
            <div className="mb-6 grid gap-4 lg:grid-cols-12">
              {/* CUSTOMER */}
              <InvoiceFormGroup title="Cliente" className="lg:col-span-9">
                <div className="grid gap-2 lg:grid-cols-2">
                  {/* SELECT CUSTOMER */}
                  <Select
                    className="lg:col-span-2"
                    value={customerId}
                    onChange={value => setCustomerId(value)}
                    data={customers.map(customer => ({ value: customer.id, label: customer.fullName }))}
                    size="xs"
                    placeholder="Buscar cliente"
                    icon={<IconSearch size={15} />}
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
              <InvoiceFormGroup title="Facturación" className="lg:col-span-3">
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
                />
              </InvoiceFormGroup>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="new-item" pt="lg">
            <InvoiceFormNewItem customerName={customerName} summary={summary} addItem={addItem} />
          </Tabs.Panel>

          <Tabs.Panel value="new-payment" pt="lg">
            <InvoiceFormPayment customerName={customerName} invoiceDate={expeditionDate} addPayment={addPayment} />
          </Tabs.Panel>
        </Tabs>

        {/* ITEM LIST AND PAYMENTS */}
        <div className="mb-6 grid w-full items-start gap-4 lg:grid-cols-3">
          {/* ITEM LIST */}
          <div className="lg:col-span-2">
            <InvoiceFormItemList items={items} removeItem={removeItem} summary={summary} />
          </div>
          {/* Payments */}
          <div>
            <InvoiceFormPaymentList payments={cashPayments} removePayment={removePayment} summary={summary} />
          </div>
        </div>
      </div>
      <footer className="flex flex-col items-center justify-end gap-4 px-6 py-4 lg:flex-row">
        <Checkbox
          label="¿Es un apartado?"
          checked={isSeparate}
          onChange={({ currentTarget }) => setIsSeparate(currentTarget.checked)}
        />

        <Button
          size="md"
          className="min-w-[300px]"
          leftIcon={<IconFileInvoice size={18} />}
          loading={loading}
          disabled={!enabled}
          onClick={checkIn}
        >
          {isSeparate ? 'Registrar Apartado' : summary.balance ? 'Registrar Credito' : 'Registrar Factura'}
        </Button>
      </footer>
    </Modal>
  );
};

export default InvoiceForm;
