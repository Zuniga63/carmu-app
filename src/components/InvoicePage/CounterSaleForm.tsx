import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { IInvoiceStoreData, INewInvoiceItem } from '@/types';

import { hideCounterSaleForm, invoicePageSelector, storeNewInvoice } from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useConfigStore } from '@/store/config-store';
import { useAuthStore } from '@/store/auth-store';

import { addNewItemToList } from '@/logic/invoices-form';

import { Button, Group, Modal, Tabs } from '@mantine/core';
import { IconDeviceFloppy, IconUsers } from '@tabler/icons-react';

import { IInvoiceCustomer } from './InvoiceForm';
import InvoiceFormCustomer from './InvoiceFormCustomer';
import InvoiceFormHeader from './InvoiceFormHeader';
import CounterSaleBoxSelect from './CounterSaleBoxSelect';
import CounterSaleItemForm from './CounterSaleItemForm';
import CounterSaleItemList from './CounterSaleItemList';

const defaulCustomer: IInvoiceCustomer = {
  id: null,
  name: '',
  document: '',
  documentType: 'CC',
  address: '',
  phone: '',
};

const CounterSaleForm = () => {
  const {
    counterSaleFormOpened: opened,
    storeLoading: loading,
    storeError: error,
    storeSuccess: success,
  } = useAppSelector(invoicePageSelector);
  const user = useAuthStore(state => state.user);
  const store = useConfigStore(state => state.premiseStore);
  const dispatch = useAppDispatch();

  const [items, setItems] = useState<INewInvoiceItem[]>([]);

  // Cashbox
  const [cashboxId, setCashboxId] = useState<string | null>(null);

  // CUSTOMER
  const [customer, setCustomer] = useState(defaulCustomer);
  const [registerWithOtherData, setRegisterWithOtherData] = useState(false);

  const amount = useMemo(() => {
    return items.reduce((sum, { amount }) => sum + amount, 0);
  }, [items]);

  // ------------------------------------------------------------------------------------------------------------------
  // METHOD
  // ------------------------------------------------------------------------------------------------------------------
  const resetBox = () => {
    if (store) {
      const { defaultBox } = store;
      const id = defaultBox && defaultBox.openBox && dayjs().isAfter(defaultBox.openBox) ? defaultBox.id : null;

      setCashboxId(id);
    } else {
      setCashboxId(null);
    }
  };

  const close = () => {
    if (!loading) {
      dispatch(hideCounterSaleForm());
      resetBox();
    }
  };

  const handleAddNewItem = (newItem: INewInvoiceItem) => {
    const newList = addNewItemToList({ items, newItem });
    setItems(newList);
  };

  const removeItem = (itemId: string) => {
    const list = items.filter(item => item.id !== itemId);
    setItems(list);
  };

  const getData = (): IInvoiceStoreData => {
    return {
      sellerId: user?.id,
      premiseStoreId: store ? store.id : undefined,
      isSeparate: false,
      sellerName: user?.name,
      customerId: customer.id || undefined,
      customerName: customer.name || undefined,
      customerAddress: customer.address.trim() || undefined,
      customerDocument: customer.document || undefined,
      customerDocumentType: customer.documentType || undefined,
      customerPhone: customer.phone || undefined,
      expeditionDate: dayjs().toDate(),
      expirationDate: dayjs().add(1, 'month').toDate(),
      cash: amount,
      items: items.map(item => ({ ...item, id: undefined, amount: undefined })),
      cashPayments: [
        {
          cashboxId: cashboxId || undefined,
          description: 'Pago en efectivo',
          amount: amount,
          register: true,
        },
      ],
      registerWithOtherCustomerData: registerWithOtherData,
    };
  };

  const checkIn = () => {
    if (amount > 0) {
      const invoiceData = getData();
      dispatch(storeNewInvoice(invoiceData));
    }
  };

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  useEffect(resetBox, [store]);

  useEffect(() => {
    if (success) {
      setItems([]);
      setCustomer(defaulCustomer);
      setRegisterWithOtherData(false);
      close();
    }
  }, [success]);

  return (
    <Modal opened={opened} onClose={close} padding={0} withCloseButton={false} size="xl">
      <InvoiceFormHeader onClose={close} isSeparate={false} />
      <div className="mx-auto mb-8 flex w-11/12 flex-col">
        <CounterSaleBoxSelect value={cashboxId} onChange={setCashboxId} />

        <Tabs defaultValue="items" className="mb-8">
          <Tabs.List>
            <Tabs.Tab value="items">Items</Tabs.Tab>
            <Tabs.Tab value="customer" icon={<IconUsers size={14} />}>
              Cliente
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="items" pt="xs">
            <CounterSaleItemForm onAddItem={handleAddNewItem} />
          </Tabs.Panel>

          <Tabs.Panel value="customer" pt="xl">
            <InvoiceFormCustomer
              className="lg:col-span-9"
              customer={customer}
              onCustomerChange={setCustomer}
              registerWithOtherData={registerWithOtherData}
              setRegisterWithOtherData={setRegisterWithOtherData}
            />
          </Tabs.Panel>
        </Tabs>

        {/* ITEMS */}
        <CounterSaleItemList items={items} onRemoveItem={removeItem} />

        <Group position="center" mt="xl">
          <Button
            onClick={checkIn}
            leftIcon={<IconDeviceFloppy size={24} stroke={2.5} />}
            loading={loading}
            disabled={amount <= 0}
          >
            Registrar Venta
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default CounterSaleForm;
