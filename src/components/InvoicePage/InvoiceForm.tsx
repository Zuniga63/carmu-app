import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useMediaQuery } from '@mantine/hooks';
import {
  IInvoiceStoreData,
  IInvoiceSummary,
  INewInvoiceItem,
  INewInvoicePayment,
} from 'src/types';

import { Button, Modal, Stepper, Switch } from '@mantine/core';
import {
  IconArrowBack,
  IconArrowNarrowRight,
  IconBox,
  IconCircleCheck,
  IconDatabase,
  IconFileDollar,
  IconFileInvoice,
} from '@tabler/icons';

import InvoiceFormHeader from './InvoiceFormHeader';
import InvoiceFormPayment from './InvoiceFormPayment';
import InvoiceFormCustomer from './InvoiceFormCustomer';
import InvoiceFormDates from './InvoiceFormDates';
import InvoiceFormItems from './InvoiceFormItems';
import InvoiceFormConfirm from './InvoiceFormConfirm';
import {
  hideNewInvoiceForm,
  invoicePageSelector,
  storeNewInvoice,
} from 'src/features/InvoicePage';
import { authSelector } from 'src/features/Auth';

export enum InvoiceSteps {
  Invoicing,
  Items,
  Payments,
  Confirm,
  Complete,
}

export interface IInvoiceCustomer {
  id: string | null;
  name: string;
  document: string;
  documentType: string;
  phone: string;
  address: string;
}

const InvoiceForm = () => {
  const {
    formOpened: opened,
    storeLoading: loading,
    storeError: error,
    storeSuccess: success,
  } = useAppSelector(invoicePageSelector);
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const [enabled, setEnabled] = useState(false);
  const largeScreen = useMediaQuery('(min-width: 768px)');

  // ------------------------------------------------------------------------------------------------------------------
  // INVOICE STEP
  // ------------------------------------------------------------------------------------------------------------------
  const [step, setStep] = useState(InvoiceSteps.Invoicing);
  const nextStep = () =>
    setStep(current =>
      current < InvoiceSteps.Confirm ? current + 1 : current
    );
  const prevStep = () =>
    setStep(current =>
      current > InvoiceSteps.Invoicing ? current - 1 : current
    );

  // CUSTOMER
  const [customer, setCustomer] = useState<IInvoiceCustomer>({
    id: null,
    name: '',
    document: '',
    documentType: 'CC',
    address: '',
    phone: '',
  });

  // INVOICING
  const [expeditionDate, setExpeditionDate] = useState<Date | null>(
    dayjs().toDate()
  );
  const [expirationDate, setExpirationDate] = useState<Date | null>(
    dayjs().add(1, 'month').toDate()
  );
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
  const closeInvoice = () => {
    if (!loading) {
      dispatch(hideNewInvoiceForm());
    }
  };

  const getData = (): IInvoiceStoreData => {
    return {
      sellerId: user?.id,
      customerId: customer.id || undefined,
      isSeparate,
      customerName: customer.name || undefined,
      customerAddress: customer.address.trim() || undefined,
      customerDocument: customer.document || undefined,
      customerDocumentType: customer.documentType || undefined,
      customerPhone: customer.phone || undefined,
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
    cash = cashPayments.reduce(
      (prevValue, currentPayment) => prevValue + currentPayment.amount,
      0
    );

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
    setCustomer(current => ({ ...current, id: null }));
    setIsSeparate(false);
    setItems([]);
    setCashPayments([]);
    setStep(InvoiceSteps.Invoicing);
  };

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
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
    if (!summary.balance && step === InvoiceSteps.Payments) nextStep();
  }, [items, cashPayments]);

  // To determine wheter or not to save the invoice
  useEffect(() => {
    setEnabled(
      (summary.amount > 0 && !summary.balance) ||
        Boolean(
          (customer.id && customer.name) ||
            (customer.name && customer.document && customer.documentType)
        )
    );
  }, [
    customer.name,
    customer.document,
    customer.documentType,
    summary.amount,
    summary.balance,
  ]);

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
      <div className="px-6 py-2 lg:py-6">
        <Stepper active={step} onStepClick={setStep} size="xs">
          <Stepper.Step
            label="Facturación"
            icon={<IconFileInvoice size={18} />}
            disabled={loading}
          >
            <div className="grid gap-4 lg:grid-cols-12 lg:gap-y-2">
              {/* CUSTOMER */}
              <InvoiceFormCustomer
                className="lg:col-span-9"
                customer={customer}
                onCustomerChange={setCustomer}
              />

              <InvoiceFormDates
                expeditionDate={expeditionDate}
                expirationDate={expirationDate}
                onUpdateExpedition={setExpeditionDate}
                onUpdateExpiration={setExpirationDate}
                className="lg:col-span-3"
              />

              <div className="lg:col-span-12">
                <Switch
                  checked={isSeparate}
                  label="Es un apartado"
                  onChange={({ currentTarget }) => {
                    setIsSeparate(currentTarget.checked);
                  }}
                />
              </div>
            </div>
          </Stepper.Step>

          <Stepper.Step
            label="Productos"
            icon={<IconBox size={18} />}
            disabled={loading}
          >
            <InvoiceFormItems
              items={items}
              setItems={setItems}
              summary={summary}
            />
          </Stepper.Step>

          <Stepper.Step
            label="Forma de pago"
            icon={<IconFileDollar size={18} />}
            disabled={loading}
          >
            <InvoiceFormPayment
              summary={summary}
              invoiceDate={expeditionDate}
              payments={cashPayments}
              setPayments={setCashPayments}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Confirmar"
            icon={<IconCircleCheck size={18} />}
            loading={loading}
          >
            <InvoiceFormConfirm
              customer={customer}
              items={items}
              payments={cashPayments}
              summary={summary}
            />
          </Stepper.Step>
          <Stepper.Completed>Validate</Stepper.Completed>
        </Stepper>

        <div className="mt-8 flex justify-center gap-x-4">
          <Button
            variant="default"
            onClick={prevStep}
            leftIcon={<IconArrowBack />}
            disabled={loading}
          >
            Atras
          </Button>
          {step !== InvoiceSteps.Confirm ? (
            <Button
              onClick={nextStep}
              rightIcon={<IconArrowNarrowRight />}
              disabled={loading}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={checkIn}
              rightIcon={<IconDatabase />}
              loading={loading}
              disabled={!enabled}
            >
              {isSeparate ? <span>Registrar Apartado</span> : null}
              {!isSeparate && summary.balance ? (
                <span>Registrar Crédito</span>
              ) : null}
              {!isSeparate && !summary.balance ? (
                <span>Registrar Venta</span>
              ) : null}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceForm;
