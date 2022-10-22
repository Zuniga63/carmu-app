import React, { useState, useEffect, useRef } from 'react';
import { NumberInput, Select, TextInput } from '@mantine/core';
import { useAppSelector } from 'store/hooks';
import { IconCategory, IconPlus, IconX } from '@tabler/icons';
import ProductSelect from './ProductSelect';
import InvoiceFormGroup from './InvoiceFormGroup';
import { INewInvoiceItem } from 'types';
import { toast } from 'react-toastify';

interface Props {
  addItem(newItem: INewInvoiceItem): void;
}

const InvoiceFormNewItem = ({ addItem }: Props) => {
  const { products, categories } = useAppSelector(state => state.InvoicePageReducer);
  const selectRef = useRef<HTMLInputElement>(null);

  const [productId, setProductId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState<number | undefined>(1);
  const [itemUnitValue, setItemUnitValue] = useState<number | undefined>(undefined);
  const [itemDiscount, setItemDiscount] = useState<number | undefined>(undefined);
  const [itemAmount, setItemAmount] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);

  const resetItem = () => {
    setProductId(null);
    setCategoryId(null);
    setItemDescription('');
    setItemQuantity(1);
    setItemUnitValue(undefined);
    setItemDiscount(undefined);
    if (selectRef.current) selectRef.current.focus();
  };

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  const add = () => {
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

    addItem(item);
    resetItem();

    toast.info(`¡El item "${item.description}" fue agregado!`);
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
    if (itemQuantity && itemUnitValue) {
      let amount = itemQuantity * itemUnitValue;
      if (itemDiscount && itemDiscount < itemUnitValue) amount -= itemQuantity * itemDiscount;
      setItemAmount(amount);
    } else {
      setItemAmount(undefined);
    }
  }, [itemQuantity, itemUnitValue, itemDiscount]);

  useEffect(() => {
    setEnabled(Boolean(itemAmount && itemDescription && itemAmount > 0));
  }, [itemAmount, itemDescription]);

  return (
    <InvoiceFormGroup title="Agregar Item">
      <div className="flex items-center gap-x-4">
        <div className="flex-grow">
          {/* CATEGORY & PRODUCT */}
          <div className="mb-2 grid grid-cols-4 gap-x-2">
            {/* PRODUCT */}
            <ProductSelect
              products={products}
              productId={productId}
              selectRef={selectRef}
              onSelect={setProductId}
              className="col-span-2"
            />

            {/* category */}
            <Select
              placeholder="Selecciona categoría"
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
          </div>

          {/* ITEM INFO */}
          <div className="grid grid-cols-12 gap-x-2">
            {/* ITEM DESCRIPTION */}
            <TextInput
              label="Descripción"
              className="col-span-5"
              value={itemDescription}
              placeholder="Nombre del producto o servicio"
              size="xs"
              onChange={({ target }) => setItemDescription(target.value)}
            />

            {/* QUANTITY */}
            <NumberInput
              label="Cant."
              placeholder="1.0"
              value={itemQuantity}
              onChange={val => setItemQuantity(val)}
              size="xs"
              min={1}
              step={1}
              type="number"
            />
            {/* UNIT VALUE */}
            <NumberInput
              label="Vlr. Unt"
              placeholder="1.0"
              className="col-span-2"
              hideControls
              size="xs"
              value={itemUnitValue}
              min={50}
              step={100}
              precision={2}
              onFocus={({ target }) => target.select()}
              onChange={value => setItemUnitValue(value)}
              parser={value => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={formater}
            />
            {/* DISCOUNT */}
            <NumberInput
              label="Desc. Unt"
              placeholder="1.0"
              className="col-span-2"
              hideControls
              size="xs"
              value={itemDiscount}
              min={50}
              max={itemUnitValue}
              step={100}
              precision={2}
              onFocus={({ target }) => target.select()}
              onChange={value => setItemDiscount(value)}
              parser={value => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={formater}
            />

            {/* AMOUNT */}
            <NumberInput
              label="Importe"
              placeholder="1.0"
              className="col-span-2"
              hideControls
              size="xs"
              readOnly
              value={itemAmount}
              precision={2}
              parser={value => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={formater}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-4">
          <button
            className="rounded-full border border-green-400 border-opacity-50 p-2 text-green-500 transition-colors  hover:border-green-400 hover:text-light active:border-green-800 active:text-green-800 disabled:opacity-20"
            disabled={!enabled}
            onClick={add}
          >
            <IconPlus size={20} stroke={3} />
          </button>
          <button
            className="rounded-full border border-red-400 border-opacity-50 p-2 text-red-500 transition-colors  hover:border-red-400 hover:text-light active:border-red-800 active:text-red-800"
            onClick={resetItem}
          >
            <IconX size={20} stroke={3} />
          </button>
        </div>
      </div>
    </InvoiceFormGroup>
  );
};

export default InvoiceFormNewItem;
