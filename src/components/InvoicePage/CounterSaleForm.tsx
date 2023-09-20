import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { IInvoiceStoreData, INewInvoiceItem } from '@/types';

import { categoryPageSelector } from '@/features/CategoryPage';
import { hideCounterSaleForm, invoicePageSelector, storeNewInvoice } from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useConfigStore } from '@/store/config-store';
import { useAuthStore } from '@/store/auth-store';

import { currencyFormat } from '@/utils';
import { addNewItemToList } from '@/logic/invoices-form';

import { Button, Group, Modal, Table, Tabs } from '@mantine/core';
import { IconDeviceFloppy, IconTrash, IconUsers } from '@tabler/icons-react';

import { IInvoiceCustomer } from './InvoiceForm';
import InvoiceFormCustomer from './InvoiceFormCustomer';
import InvoiceFormHeader from './InvoiceFormHeader';
import CounterSaleBoxSelect from './CounterSaleBoxSelect';
import CounterSaleItemForm from './CounterSaleItemForm';

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
  const { categories } = useAppSelector(categoryPageSelector);
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

  const getItemCategory = (item: INewInvoiceItem) => {
    const result: string[] = [];
    item.categories.forEach(categoryId => {
      const category = categories.find(c => c.id === categoryId);
      if (category) result.push(category.name);
    });

    return result.length > 0 ? result.join(' ') : 'Sin categoría';
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
        <div className="min-h-[150px]">
          <Table horizontalSpacing="sm" striped highlightOnHover fontSize="sm">
            <thead>
              <tr className="whitespace-nowrap">
                <th scope="col">
                  <span className="block text-center uppercase tracking-wide">Cant.</span>
                </th>
                <th scope="col" className="uppercase tracking-wide">
                  Descripción
                </th>
                <th scope="col" className="uppercase tracking-wide">
                  Vlr. Unt
                </th>
                <th scope="col" className="uppercase tracking-wide">
                  Importe
                </th>
                <th scope="col" className="relative uppercase tracking-wide">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-2 py-1 text-center text-sm">{item.quantity}</td>
                  <td>
                    <span className="block">{item.description}</span>
                    <span className="block text-xs text-dark text-opacity-80 dark:text-light dark:text-opacity-80">
                      {getItemCategory(item)}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col text-right text-sm">
                      <span className={`${Boolean(item.discount) && 'scale-90 text-xs line-through opacity-70'}`}>
                        {currencyFormat(item.unitValue)}
                      </span>
                      {Boolean(item.discount) && <span>{currencyFormat(item.unitValue - (item.discount || 0))}</span>}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-1 text-right">{currencyFormat(item.amount)}</td>
                  <td>
                    <div className="flex w-full items-center justify-center">
                      <button
                        className="rounded-full border border-transparent p-1 text-red-500 transition-colors hover:border-red-500 hover:bg-red-100 hover:text-opacity-70 hover:shadow-md active:text-opacity-90"
                        onClick={() => removeItem(item.id)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {amount > 0 ? (
            <div className="mt-4 flex justify-end">
              <p className="text-lg">
                Total: <span className="font-bold">{currencyFormat(amount)}</span>
              </p>
            </div>
          ) : null}
        </div>

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
