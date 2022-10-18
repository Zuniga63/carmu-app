import { Select } from '@mantine/core';
import { IconBox } from '@tabler/icons';
import React, { forwardRef } from 'react';
import { IImage, IInvoiceProduct } from 'types';
import { normalizeText } from 'utils';

interface Props {
  products: IInvoiceProduct[];
  onSelect(id: string | null): void;
  productId: string | null;
  className?: string;
  selectRef: React.RefObject<HTMLInputElement>;
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image?: IImage;
  label: string;
  description?: string;
  productref?: string;
  barcode?: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, description, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <h2 className="font-bold">{label}</h2>
    <p className="text-xs italic">{description}</p>
  </div>
));

SelectItem.displayName = 'SelectItemProduct';

const ProductSelect = ({ products, onSelect, productId, className, selectRef }: Props) => {
  return (
    <Select
      className={className}
      placeholder="Busca o selecciona un producto"
      icon={<IconBox size={14} />}
      size="xs"
      itemComponent={SelectItem}
      value={productId}
      data={products.map(product => ({
        value: product.id,
        label: product.name,
        description: product.description,
        productref: product.ref,
        barcode: product.barcode,
      }))}
      searchable
      clearable
      filter={(value, item) => {
        const text = normalizeText(`${item.label} ${item.description} ${item.productref} ${item.barcode}`);
        return text.includes(normalizeText(value));
      }}
      onChange={onSelect}
      ref={selectRef}
    />
  );
};

export default ProductSelect;
