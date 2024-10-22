import dayjs from 'dayjs';
import type { IInvoiceStoreData, IInvoiceSummary, INewInvoiceItem, INewInvoicePayment } from '@/types';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useAuthStore } from '@/store/auth-store';
import { useConfigStore } from '@/store/config-store';
import { useQueryClient } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { useInvoicePageStore } from '@/store/invoices-page.store';
import { useCreateInvoice } from '@/hooks/react-query/invoices.hooks';

import {
  IconArrowBack,
  IconArrowNarrowRight,
  IconBox,
  IconCircleCheck,
  IconDatabase,
  IconFileDollar,
  IconFileInvoice,
} from '@tabler/icons-react';

import { Button, Stepper, Switch } from '@mantine/core';
import InvoiceFormConfirm from './InvoiceFormConfirm';
import InvoiceFormPayment from './InvoiceFormPayment';
import InvoiceFormCustomer from './InvoiceFormCustomer';
import InvoiceFormDates from './InvoiceFormDates';
import InvoiceFormItems from './InvoiceFormItems';
import InvoiceFormModal from './InvoiceFormModal';

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
  email: string;
}

const defaulCustomer: IInvoiceCustomer = {
  id: null,
  name: '',
  document: '',
  documentType: 'CC',
  address: '',
  phone: '',
  email: '',
};

const InvoiceForm = () => {
  const user = useAuthStore(state => state.user);
  const premiseStoreSelected = useConfigStore(state => state.premiseStore);
  const isOpen = useInvoicePageStore(state => state.generalFormIsOpen);
  const closeForm = useInvoicePageStore(state => state.hideGeneralForm);
  const showPrinterModal = useInvoicePageStore(state => state.showPrinterModal);

  const [enabled, setEnabled] = useState(false);
  const largeScreen = useMediaQuery('(min-width: 768px)');
  const queryCache = useQueryClient();

  const { mutate: createNewInvoice, isPending, isSuccess, data, error } = useCreateInvoice();

  // ------------------------------------------------------------------------------------------------------------------
  // INVOICE STEP
  // ------------------------------------------------------------------------------------------------------------------
  const [step, setStep] = useState(InvoiceSteps.Invoicing);
  const nextStep = () => setStep(current => (current < InvoiceSteps.Confirm ? current + 1 : current));
  const prevStep = () => setStep(current => (current > InvoiceSteps.Invoicing ? current - 1 : current));

  // CUSTOMER
  const [customer, setCustomer] = useState<IInvoiceCustomer>({
    id: null,
    name: '',
    document: '',
    documentType: 'CC',
    address: '',
    phone: '',
    email: '',
  });

  const [registerWithOtherData, setRegisterWithOtherData] = useState(false);

  // INVOICING
  const [expeditionDate, setExpeditionDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
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
    if (!isPending) {
      closeForm();
    }
  };

  const getData = (): IInvoiceStoreData => {
    return {
      sellerId: user?.id,
      customerId: customer.id || undefined,
      premiseStoreId: premiseStoreSelected ? premiseStoreSelected.id : undefined,
      isSeparate,
      customerName: customer.name || undefined,
      customerAddress: customer.address.trim() || undefined,
      customerDocument: customer.document || undefined,
      customerDocumentType: customer.documentType || undefined,
      customerPhone: customer.phone || undefined,
      customerEmail: customer.email || undefined,
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
      registerWithOtherCustomerData: registerWithOtherData,
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
      // dispatch(storeNewInvoice(invoiceData));
      createNewInvoice(invoiceData);
    }
  };

  const resetForm = () => {
    setCustomer(current => ({ ...current, id: null }));
    setIsSeparate(false);
    setItems([]);
    setCashPayments([]);
    setStep(InvoiceSteps.Invoicing);
    setRegisterWithOtherData(false);
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
    let isOk = summary.amount > 0;

    if (summary.balance) {
      isOk = Boolean((customer.id && customer.name) || (customer.name && customer.document && customer.documentType));
    }
    setEnabled(isOk);
  }, [customer.name, customer.document, customer.documentType, summary.amount, summary.balance, summary.amount]);

  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  useEffect(() => {
    if (!isSuccess) return;
    if (customer) queryCache.invalidateQueries({ queryKey: [ServerStateKeysEnum.Customers] });

    toast.success('Factura Creada');
    closeInvoice();
    resetForm();
    if (data) showPrinterModal(data.id);
  }, [isSuccess]);

  useEffect(() => {
    if (!customer.id) {
      setCustomer(defaulCustomer);
    }
  }, [customer.id]);

  return (
    <InvoiceFormModal isOpen={isOpen} size={largeScreen ? '80%' : '100%'} onClose={closeInvoice}>
      <div className="px-6 py-2 lg:py-6">
        <Stepper active={step} onStepClick={setStep} size="xs">
          {/* PRODUCTS */}
          <Stepper.Step label="Productos" icon={<IconBox size={18} />} disabled={isPending}>
            <InvoiceFormItems items={items} setItems={setItems} summary={summary} />
          </Stepper.Step>

          {/* INVOICING */}
          <Stepper.Step label="Facturación" icon={<IconFileInvoice size={18} />} disabled={isPending}>
            <div className="grid gap-4 lg:grid-cols-12 lg:gap-y-2">
              {/* CUSTOMER */}
              <InvoiceFormCustomer
                className="lg:col-span-9"
                customer={customer}
                onCustomerChange={setCustomer}
                registerWithOtherData={registerWithOtherData}
                setRegisterWithOtherData={setRegisterWithOtherData}
              />

              <InvoiceFormDates
                expeditionDate={expeditionDate}
                expirationDate={expirationDate}
                onUpdateExpedition={setExpeditionDate}
                onUpdateExpiration={setExpirationDate}
                className="lg:col-span-3"
              />
            </div>
          </Stepper.Step>

          {/* PAYMENTS */}
          <Stepper.Step label="Forma de pago" icon={<IconFileDollar size={18} />} disabled={isPending}>
            <InvoiceFormPayment
              summary={summary}
              invoiceDate={expeditionDate}
              payments={cashPayments}
              setPayments={setCashPayments}
            />
          </Stepper.Step>

          {/* CONFIRM */}
          <Stepper.Step label="Confirmar" icon={<IconCircleCheck size={18} />} loading={isPending}>
            <InvoiceFormConfirm
              customer={customer}
              items={items}
              payments={cashPayments}
              summary={summary}
              expeditionDate={expeditionDate}
            />
          </Stepper.Step>
          <Stepper.Completed>Validate</Stepper.Completed>
        </Stepper>

        <div className="mt-8 flex items-center justify-center gap-x-4">
          <Switch
            checked={isSeparate}
            label="Es un apartado"
            onChange={({ currentTarget }) => {
              setIsSeparate(currentTarget.checked);
            }}
            className="flex"
          />
          <Button variant="default" onClick={prevStep} leftIcon={<IconArrowBack />} disabled={isPending}>
            Atras
          </Button>
          {step !== InvoiceSteps.Confirm ? (
            <Button onClick={nextStep} rightIcon={<IconArrowNarrowRight />} disabled={isPending}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={checkIn} rightIcon={<IconDatabase />} loading={isPending} disabled={!enabled}>
              {isSeparate ? <span>Registrar Apartado</span> : null}
              {!isSeparate && summary.balance ? <span>Registrar Crédito</span> : null}
              {!isSeparate && !summary.balance ? <span>Registrar Venta</span> : null}
            </Button>
          )}
        </div>
      </div>
    </InvoiceFormModal>
  );
};

export default InvoiceForm;
