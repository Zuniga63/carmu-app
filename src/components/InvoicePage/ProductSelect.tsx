import { Select, SelectItem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React, { forwardRef, KeyboardEvent } from 'react';
import { IImage, IInvoiceProduct } from '@/types';
import { normalizeText } from '@/lib/utils';

interface Props {
  products: IInvoiceProduct[];
  disabled?: boolean;
  onSelect(id: string | null): void;
  onEnterPress(event: KeyboardEvent<HTMLInputElement>, maintainFocus?: boolean): void;
  productId: string | null;
  className?: string;
  selectRef?: React.RefObject<HTMLInputElement>;
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image?: IImage;
  label: string;
  description?: string;
  productref?: string;
  barcode?: string;
  stock?: number;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, productref, stock, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <h2 className="font-bold">
        {label}
        {Boolean(stock) && <span className="ml-2 text-xs font-normal">({stock} und)</span>}
      </h2>
      <p className="line-clamp-1 text-xs italic">{description}</p>
      {productref && (
        <p className="line-clamp-1 text-xs italic">
          ref: <span className="tracking-widest">{productref}</span>
        </p>
      )}
    </div>
  ),
);

SelectItem.displayName = 'SelectItemProduct';

const ProductSelect = ({
  products,
  onSelect,
  productId,
  className,
  selectRef,
  onEnterPress,
  disabled = false,
}: Props) => {
  const filter = (value: string, item: SelectItem) => {
    const text = normalizeText(`${item.label} ${item.description} ${item.productref} ${item.barcode}`);
    return text.includes(normalizeText(value));
  };

  return (
    <Select
      className={className}
      placeholder="Busca o selecciona un producto"
      icon={<IconSearch size={14} />}
      size="xs"
      itemComponent={SelectItem}
      value={productId}
      data={products.map(product => ({
        value: product.id,
        label: product.name,
        description: product.description,
        productref: product.ref,
        barcode: product.barcode,
        stock: product.stock,
      }))}
      searchable
      clearable
      filter={filter}
      onChange={onSelect}
      ref={selectRef}
      onKeyDown={event => onEnterPress(event, true)}
      name="productSelect"
      disabled={disabled}
    />
  );
};

export default ProductSelect;
