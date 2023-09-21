import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useAppSelector } from '@/store/hooks';
import { IconCategory, IconPlus, IconTrash } from '@tabler/icons-react';
import ProductSelect from './ProductSelect';
import InvoiceFormGroup from './InvoiceFormGroup';
import { IInvoiceSummary, INewInvoiceItem } from '@/types';
import { currencyFormat } from '@/utils';
import InvoiceFormItemList from './InvoiceFormItemList';
import { categoryPageSelector } from '@/features/CategoryPage';
import { useGetAllLiteProducts } from '@/hooks/react-query/product.hooks';

interface Props {
  items: INewInvoiceItem[];
  summary: IInvoiceSummary;
  setItems: React.Dispatch<React.SetStateAction<INewInvoiceItem[]>>;
}

const InvoiceFormItems: React.FC<Props> = ({ items, summary, setItems }) => {
  // --------------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------------
  const { categories } = useAppSelector(categoryPageSelector);
  const [productId, setProductId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState<number | undefined>(1);
  const [itemUnitValue, setItemUnitValue] = useState<number | undefined>(undefined);
  const [itemDiscount, setItemDiscount] = useState<number | undefined>(undefined);
  const [itemAmount, setItemAmount] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);
  const { data: products } = useGetAllLiteProducts();

  // --------------------------------------------------------------------------
  // REF
  // --------------------------------------------------------------------------
  const searchRef = useRef<HTMLInputElement>(null);
  const defaultRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------------------------------
  // METHODS
  // --------------------------------------------------------------------------

  const resetItem = (focus: 'search' | 'category' = 'category') => {
    setProductId(null);
    setCategoryId(null);
    setItemDescription('');
    setItemQuantity(1);
    setItemUnitValue(undefined);
    setItemDiscount(undefined);
    if (focus === 'search' && searchRef.current) searchRef.current.focus();
    else if (defaultRef.current) defaultRef.current.focus();
  };

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  const createItem = (): INewInvoiceItem => {
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

    return newItem;
  };

  const findIfItemExist = (newItem: INewInvoiceItem): INewInvoiceItem | undefined => {
    return items.find(item => {
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
  };

  const add = (from: 'search' | 'other' = 'other') => {
    const newItem = createItem();
    const oldItem = findIfItemExist(newItem);

    if (oldItem) {
      const index = items.findIndex(item => item.id === oldItem.id);
      oldItem.quantity += newItem.quantity;
      oldItem.amount += newItem.amount;

      setItems(current => {
        const list = current.slice();
        list.splice(index, 1, oldItem);
        return list;
      });
    } else {
      setItems(current => [...current, newItem]);
    }

    resetItem(from === 'other' ? 'category' : 'search');
  };

  const removeItem = (itemId: string) => {
    const list = items.filter(item => item.id !== itemId);
    setItems(list);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>, maintainFocus?: boolean) => {
    if (event.key === 'Enter' && itemDescription && itemQuantity && itemUnitValue) {
      if (!maintainFocus) event.currentTarget.blur();
      add(event.currentTarget.type === 'search' ? 'search' : 'other');
    }
  };

  useEffect(() => {
    if (productId) {
      const product = products?.find(p => p.id === productId);
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
    <>
      <InvoiceFormGroup className="mb-8">
        <>
          <div className="mb-4 flex items-center gap-x-4">
            <div className="flex-grow">
              {/* PRODUCT */}
              <ProductSelect
                products={products || []}
                productId={productId}
                selectRef={searchRef}
                onSelect={setProductId}
                onEnterPress={handleKeyPress}
                className="mb-2"
              />

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
                  ref={defaultRef}
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

          <div className="flex flex-col items-center justify-end gap-x-2 lg:flex-row">
            {itemAmount ? <span className="text-xs">Importe: {currencyFormat(itemAmount)}</span> : null}
            <div className="flex flex-col items-center justify-end gap-4 lg:flex-row">
              <Button leftIcon={<IconPlus size={15} stroke={4} />} size="xs" disabled={!enabled} onClick={() => add()}>
                Agregar Item
              </Button>
              <Button leftIcon={<IconTrash size={15} stroke={2} />} size="xs" color="red" onClick={() => resetItem()}>
                Descartar Item
              </Button>
            </div>
          </div>
        </>
      </InvoiceFormGroup>

      <InvoiceFormItemList items={items} removeItem={removeItem} summary={summary} />
    </>
  );
};

export default InvoiceFormItems;
