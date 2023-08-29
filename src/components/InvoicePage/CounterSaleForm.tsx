import { Button, Group, Modal, NumberInput, Select, Table, Tabs, TextInput } from '@mantine/core';
import { IconBox, IconCategory, IconDeviceFloppy, IconPlus, IconTrash, IconUsers } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { authSelector } from '@/features/Auth';
import { boxPageSelector } from '@/features/BoxPage';
import { categoryPageSelector } from '@/features/CategoryPage';
import { configSelector } from '@/features/Config';
import { hideCounterSaleForm, invoicePageSelector, storeNewInvoice } from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IInvoiceStoreData, IInvoiceSummary, INewInvoiceItem } from '@/types';
import { currencyFormat } from '@/utils';
import { IInvoiceCustomer } from './InvoiceForm';
import InvoiceFormCustomer from './InvoiceFormCustomer';
import InvoiceFormHeader from './InvoiceFormHeader';
import ProductSelect from './ProductSelect';

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
    products,
    storeLoading: loading,
    storeError: error,
    storeSuccess: success,
  } = useAppSelector(invoicePageSelector);
  const { user } = useAppSelector(authSelector);
  const { boxes } = useAppSelector(boxPageSelector);
  const { categories } = useAppSelector(categoryPageSelector);
  const { premiseStoreSelected: store } = useAppSelector(configSelector);
  const dispatch = useAppDispatch();

  // ITEMS
  const searchRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

  const [productId, setProductId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState<number | undefined>(1);
  const [itemUnitValue, setItemUnitValue] = useState<number | undefined>(undefined);
  const [itemDiscount, setItemDiscount] = useState<number | undefined>(undefined);
  const [itemAmount, setItemAmount] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);

  const [items, setItems] = useState<INewInvoiceItem[]>([]);

  // Cashbox
  const [cashboxId, setCashboxId] = useState<string | null>(null);
  // const [box, setBox] = useState<IInvoiceCashbox | null>(null);

  // CUSTOMER
  const [customer, setCustomer] = useState(defaulCustomer);
  const [registerWithOtherData, setRegisterWithOtherData] = useState(false);

  // SUMMARY
  const [summary, setSummary] = useState<IInvoiceSummary>({
    subtotal: 0,
    discount: undefined,
    amount: 0,
    cash: undefined,
    cashChange: undefined,
    balance: undefined,
  });

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

  const updateSummary = () => {
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
    cash = balance;

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
  };

  const resetItem = (focus: 'search' | 'category' = 'category') => {
    setProductId(null);
    setCategoryId(null);
    setItemDescription('');
    setItemQuantity(1);
    setItemUnitValue(undefined);
    setItemDiscount(undefined);
    if (focus === 'search' && searchRef.current) searchRef.current.focus();
    else if (categoryRef.current) categoryRef.current.focus();
  };

  const addNewItem = (from: 'search' | 'other' = 'other') => {
    const newItem: INewInvoiceItem = {
      id: String(new Date().getTime()),
      categories: [],
      tags: [],
      description: itemDescription,
      quantity: itemQuantity || 0,
      unitValue: itemUnitValue || 0,
      discount: itemDiscount,
      amount: itemAmount || 0,
    };

    if (categoryId) newItem.categories.push(categoryId);
    if (productId) newItem.product = productId;

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

    resetItem(from === 'other' ? 'category' : 'search');
  };

  const itemKeyPress = (event: KeyboardEvent<HTMLInputElement>, maintainFocus?: boolean) => {
    if (event.key === 'Enter' && itemDescription && itemQuantity && itemUnitValue) {
      if (!maintainFocus) event.currentTarget.blur();
      addNewItem(event.currentTarget.type === 'search' ? 'search' : 'other');
    }
  };

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
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
      cash: summary.amount,
      items: items.map(item => ({ ...item, id: undefined, amount: undefined })),
      cashPayments: [
        {
          cashboxId: cashboxId || undefined,
          description: 'Pago en efectivo',
          amount: summary.amount,
          register: true,
        },
      ],
      registerWithOtherCustomerData: registerWithOtherData,
    };
  };

  const checkIn = () => {
    if (summary.amount > 0) {
      const invoiceData = getData();
      dispatch(storeNewInvoice(invoiceData));
    }
  };

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setItemDescription(product.name);
      setItemUnitValue(product.price);

      if (product.hasDiscount && product.priceWithDiscount) {
        setItemDiscount(product.price - product.priceWithDiscount);
      } else {
        setItemDiscount(undefined);
      }

      if (product.categories.length > 0) setCategoryId(product.categories[0]);
    }
  }, [productId]);

  useEffect(() => {
    if (itemQuantity && itemUnitValue) {
      let amount = itemQuantity * itemUnitValue;
      if (itemDiscount && itemDiscount < itemUnitValue) amount -= itemQuantity * itemDiscount;
      setItemAmount(amount);
    } else {
      setItemAmount(undefined);
    }

    setEnabled(Boolean(itemAmount && itemDescription && itemAmount > 0));
  }, [itemQuantity, itemUnitValue, itemDiscount, itemDescription, itemAmount]);

  useEffect(updateSummary, [items]);

  // useEffect(() => {
  //   // const boxSelected = boxes.find(item => item.id === cashboxId);
  //   // setBox(boxSelected || null);
  // }, [cashboxId]);

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
        <div className="mb-8 rounded-lg border border-gray-400 p-4 shadow-lg dark:shadow dark:shadow-light">
          {/* BOX */}
          <Select
            label="Caja"
            placeholder="Selecciona una caja"
            value={cashboxId}
            onChange={setCashboxId}
            icon={<IconBox size={18} />}
            data={boxes
              .filter(item => Boolean(item.openBox))
              .map(box => ({
                value: box.id,
                label: box.name,
              }))}
            searchable
            clearable
          />
        </div>

        <Tabs defaultValue="items" className="mb-8">
          <Tabs.List>
            <Tabs.Tab value="items">Items</Tabs.Tab>
            <Tabs.Tab value="customer" icon={<IconUsers size={14} />}>
              Cliente
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="items" pt="xs">
            <div className="rounded-md bg-gray-200 p-4 shadow-lg dark:bg-header dark:shadow dark:shadow-light ">
              {/* PRODUCT */}
              <ProductSelect
                products={products}
                productId={productId}
                selectRef={searchRef}
                onSelect={setProductId}
                onEnterPress={itemKeyPress}
                className="mb-4"
              />

              {/* ITEM INFO */}
              <div className="mb-4 grid grid-cols-12 gap-2">
                {/* QUANTITY */}
                <NumberInput
                  label="Cant."
                  placeholder="1.0"
                  size="xs"
                  min={1}
                  step={1}
                  value={itemQuantity}
                  type="number"
                  onChange={val => setItemQuantity(val)}
                  onKeyDown={itemKeyPress}
                  ref={categoryRef}
                  className="col-span-4 lg:col-span-1"
                />

                {/* category */}
                <Select
                  placeholder="Selecciona categoría"
                  label="Categoría"
                  className="col-span-8 lg:col-span-2"
                  value={categoryId}
                  onChange={setCategoryId}
                  icon={<IconCategory size={14} />}
                  data={categories.map(category => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  searchable
                  clearable
                  size="xs"
                />

                {/* ITEM DESCRIPTION */}
                <TextInput
                  label="Descripción"
                  className="col-span-12 lg:col-span-5"
                  value={itemDescription}
                  placeholder="Nombre del producto o servicio"
                  size="xs"
                  onChange={({ target }) => setItemDescription(target.value)}
                />

                {/* UNIT VALUE */}
                <NumberInput
                  label="Precio"
                  placeholder="1.0"
                  className="col-span-6 lg:col-span-2"
                  hideControls
                  size="xs"
                  value={itemUnitValue}
                  min={50}
                  step={100}
                  onFocus={({ target }) => target.select()}
                  onChange={value => setItemUnitValue(value)}
                  parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                  formatter={formater}
                  onKeyDown={itemKeyPress}
                />
                {/* DISCOUNT */}
                <NumberInput
                  label="Desc. Unt"
                  placeholder="1.0"
                  className="col-span-6 lg:col-span-2"
                  hideControls
                  size="xs"
                  value={itemDiscount}
                  min={50}
                  max={itemUnitValue}
                  step={100}
                  onFocus={({ target }) => target.select()}
                  onChange={value => setItemDiscount(value)}
                  parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                  formatter={formater}
                  onKeyDown={itemKeyPress}
                />
              </div>

              <div className="flex flex-col items-center justify-end gap-4 lg:flex-row">
                {itemAmount ? <span className="text-xs">Importe: {currencyFormat(itemAmount)}</span> : null}

                <Button
                  leftIcon={<IconPlus size={15} stroke={4} />}
                  size="xs"
                  disabled={!enabled}
                  onClick={() => addNewItem()}
                >
                  Agregar Item
                </Button>
                <Button leftIcon={<IconTrash size={15} stroke={2} />} size="xs" color="red" onClick={() => resetItem()}>
                  Descartar Item
                </Button>
              </div>
            </div>
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
          {summary.amount > 0 ? (
            <div className="mt-4 flex justify-end">
              <p className="text-lg">
                Total: <span className="font-bold">{currencyFormat(summary.amount)}</span>
              </p>
            </div>
          ) : null}
        </div>

        <Group position="center" mt="xl">
          <Button
            onClick={checkIn}
            leftIcon={<IconDeviceFloppy size={24} stroke={2.5} />}
            loading={loading}
            disabled={summary.amount <= 0}
          >
            Registrar Venta
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default CounterSaleForm;
