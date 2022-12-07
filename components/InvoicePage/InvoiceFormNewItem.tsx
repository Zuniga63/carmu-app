import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Button, Checkbox, NumberInput, Select, TextInput } from '@mantine/core';
import { useAppSelector } from 'store/hooks';
import { IconBox, IconCategory, IconPlus, IconTrash } from '@tabler/icons';
import ProductSelect from './ProductSelect';
import InvoiceFormGroup from './InvoiceFormGroup';
import { IInvoiceCashbox, IInvoiceSummary, INewInvoiceItem } from 'types';
import { currencyFormat } from 'utils';
import dayjs from 'dayjs';

interface Props {
  customerName: string;
  summary: IInvoiceSummary;
  invoiceDate: Date | null;
  addItem(newItem: INewInvoiceItem, isCounterSale?: boolean, box?: IInvoiceCashbox | null): void;
}

const InvoiceFormNewItem = ({ customerName, summary, addItem, invoiceDate }: Props) => {
  const { products, categories, cashboxs } = useAppSelector(state => state.InvoicePageReducer);
  const searchRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

  const [productId, setProductId] = useState<string | null>(null);
  const [boxId, setBoxId] = useState<string | null>(null);
  const [boxList, setBoxList] = useState<IInvoiceCashbox[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState<number | undefined>(1);
  const [itemUnitValue, setItemUnitValue] = useState<number | undefined>(undefined);
  const [itemDiscount, setItemDiscount] = useState<number | undefined>(undefined);
  const [itemAmount, setItemAmount] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);
  const [isCounterSale, setIsCounterSale] = useState(false);

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

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  const add = (from: 'search' | 'other' = 'other') => {
    let box: IInvoiceCashbox | null = null;
    const item: INewInvoiceItem = {
      id: String(new Date().getTime()),
      categories: [],
      tags: [],
      description: itemDescription,
      quantity: itemQuantity || 0,
      unitValue: itemUnitValue || 0,
      discount: itemDiscount,
      amount: itemAmount || 0,
    };

    if (categoryId) item.categories.push(categoryId);
    if (productId) item.product = productId;
    if (isCounterSale) {
      box = boxList.find(item => item.id === boxId) || null;
    }

    addItem(item, isCounterSale, box);
    resetItem(from === 'other' ? 'category' : 'search');
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>, maintainFocus?: boolean) => {
    if (event.key === 'Enter' && itemDescription && itemQuantity && itemUnitValue) {
      if (!maintainFocus) event.currentTarget.blur();
      add(event.currentTarget.type === 'search' ? 'search' : 'other');
    }
  };

  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setItemDescription(product.name);
        setItemUnitValue(product.price);
        if (product.hasDiscount && product.priceWithDiscount)
          setItemDiscount(product.price - product.priceWithDiscount);
        else setItemDiscount(undefined);

        if (product.categories.length > 0) setCategoryId(product.categories[0]);
      }
    }
  }, [productId]);

  useEffect(() => {
    let date = dayjs();
    if (invoiceDate && dayjs(invoiceDate).isValid()) date = dayjs(invoiceDate);
    setBoxList(cashboxs.filter(box => Boolean(box.openBox && dayjs(box.openBox).isBefore(date))));
    setBoxId(null);
  }, [cashboxs.length, invoiceDate]);

  useEffect(() => {
    if (itemQuantity && itemUnitValue) {
      let amount = itemQuantity * itemUnitValue;
      if (itemDiscount && itemDiscount < itemUnitValue) amount -= itemQuantity * itemDiscount;
      setItemAmount(amount);
    } else {
      setItemAmount(undefined);
    }
  }, [itemQuantity, itemUnitValue, itemDiscount]);

  useEffect(() => {
    let result = Boolean(itemAmount && itemDescription && itemAmount > 0);
    if (result && isCounterSale && !boxId) result = false;

    setEnabled(result);
  }, [itemAmount, itemDescription, isCounterSale, boxId]);

  return (
    <InvoiceFormGroup title="Agregar Item">
      <div>
        <div className="mb-4 flex items-center gap-x-4">
          <div className="flex-grow">
            {/* CATEGORY & PRODUCT */}
            <div className="mb-2 grid grid-cols-8 items-center gap-2">
              {/* PRODUCT */}
              <ProductSelect
                products={products}
                productId={productId}
                selectRef={searchRef}
                onSelect={setProductId}
                onEnterPress={handleKeyPress}
                className="col-span-8 lg:col-span-4"
              />

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
                className="col-span-8 lg:col-span-2"
                disabled={!isCounterSale}
              />

              {/* Total items */}
              {summary.amount > 0 ? (
                <p className="col-span-8 pr-4 text-right text-sm italic lg:col-span-2">
                  <span>Facturado: </span>
                  <span className="font-bold tracking-widest">{currencyFormat(summary.amount)}</span>
                </p>
              ) : null}
            </div>

            {/* ITEM INFO */}
            <div className="grid grid-cols-12 gap-2">
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
                onKeyDown={handleKeyPress}
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
                onKeyDown={handleKeyPress}
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
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="mb-4 rounded-md border-2 border-red-500 px-4 py-2 text-xs lg:mb-0 lg:rounded-full">
            <p>
              Cliente: <span className="font-bold tracking-wider">{customerName || 'Mostrador'}</span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-end gap-4 lg:flex-row">
            {itemAmount ? <span className="text-xs">Importe: {currencyFormat(itemAmount)}</span> : null}
            <Checkbox
              className="flex items-center"
              label="Venta por mostrador"
              checked={isCounterSale}
              onChange={({ currentTarget }) => setIsCounterSale(currentTarget.checked)}
            />
            <Button leftIcon={<IconPlus size={15} stroke={4} />} size="xs" disabled={!enabled} onClick={() => add()}>
              Agregar Item
            </Button>
            <Button leftIcon={<IconTrash size={15} stroke={2} />} size="xs" color="red" onClick={() => resetItem()}>
              Descartar Item
            </Button>
          </div>
        </div>
      </div>
    </InvoiceFormGroup>
  );
};

export default InvoiceFormNewItem;
