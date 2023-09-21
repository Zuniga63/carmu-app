import { KeyboardEvent } from 'react';
import type { INewInvoiceItem } from '@/types';
import { useCounterSaleItemForm } from '@/hooks/use-counter-sale-item-form';
import { IconCategory, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import ProductSelect from './ProductSelect';
import { currencyFormat } from '@/utils';

type Props = {
  onAddItem: (newItem: INewInvoiceItem) => void;
};

export default function CounterSaleItemForm({ onAddItem }: Props) {
  const { products, categories, newItem, quantityRef, isEnabled, getItemData, resetState } = useCounterSaleItemForm();

  const handleAddNewItem = () => {
    if (!isEnabled) return;
    const newItem = getItemData();

    onAddItem(newItem);
    resetState();
  };

  const handleReset = () => resetState();

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isEnabled || event.key !== 'Enter') return;
    handleAddNewItem();
  };

  const numberInputFormater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  return (
    <div className="rounded-md bg-gray-200 p-4 shadow-lg dark:bg-header dark:shadow dark:shadow-light ">
      {/* PRODUCT */}
      <ProductSelect
        products={products}
        productId={newItem.productId.value}
        onSelect={newItem.productId.update}
        onEnterPress={handleKeyPress}
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
          value={newItem.quantity.value}
          type="number"
          onChange={val => newItem.quantity.update(val)}
          onKeyDown={handleKeyPress}
          ref={quantityRef}
          className="col-span-4 lg:col-span-1"
        />

        {/* category */}
        <Select
          placeholder="Selecciona categoría"
          label="Categoría"
          className="col-span-8 lg:col-span-2"
          value={newItem.categoryId.value}
          onChange={newItem.categoryId.update}
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
          value={newItem.description.value}
          placeholder="Nombre del producto o servicio"
          size="xs"
          onChange={({ target }) => newItem.description.update(target.value)}
        />

        {/* UNIT VALUE */}
        <NumberInput
          label="Precio"
          placeholder="1.0"
          className="col-span-6 lg:col-span-2"
          hideControls
          size="xs"
          value={newItem.unitValue.value}
          min={50}
          step={100}
          onFocus={({ target }) => target.select()}
          onChange={value => newItem.unitValue.update(value)}
          parser={value => value?.replace(/\$\s?|(,*)/g, '')}
          formatter={numberInputFormater}
          onKeyDown={handleKeyPress}
        />
        {/* DISCOUNT */}
        <NumberInput
          label="Desc. Unt"
          placeholder="1.0"
          className="col-span-6 lg:col-span-2"
          hideControls
          size="xs"
          value={newItem.discount.value}
          min={50}
          max={newItem.unitValue.value}
          step={100}
          onFocus={({ target }) => target.select()}
          onChange={value => newItem.discount.update(value)}
          parser={value => value?.replace(/\$\s?|(,*)/g, '')}
          formatter={numberInputFormater}
          onKeyDown={handleKeyPress}
        />
      </div>

      <div className="flex flex-col items-center justify-end gap-4 lg:flex-row">
        {newItem.amount.value ? <span className="text-xs">Importe: {currencyFormat(newItem.amount.value)}</span> : null}

        <Button leftIcon={<IconPlus size={15} stroke={4} />} size="xs" disabled={!isEnabled} onClick={handleAddNewItem}>
          Agregar Item
        </Button>
        <Button leftIcon={<IconTrash size={15} stroke={2} />} size="xs" color="red" onClick={handleReset}>
          Descartar Item
        </Button>
      </div>
    </div>
  );
}
