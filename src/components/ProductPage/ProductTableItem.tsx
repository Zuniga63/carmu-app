import { IconEdit, IconTrash } from '@tabler/icons';
import React from 'react';
import { IProductWithCategories } from 'src/types';
import { currencyFormat } from 'src/utils';

interface Props {
  product: IProductWithCategories;
  mount(customer: IProductWithCategories): void;
  onDelete(customer: IProductWithCategories): Promise<void>;
}

const ProductTableItem = ({ product, mount, onDelete }: Props) => {
  return (
    <tr className="text-gray-dark dark:text-light">
      <td className="whitespace-nowrap px-3 py-2 lg:whitespace-normal">
        <div className="text-center">
          <p className="font-bold">{product.name}</p>
          <p className="text-xs text-gray-400">{product.description}</p>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-2 text-center text-xs">
        {product.ref ? (
          <p>
            Ref: <span>{product.ref}</span>
          </p>
        ) : null}
        {product.barcode ? (
          <p>
            Codigo: <span>{product.barcode}</span>
          </p>
        ) : null}
      </td>
      <td className="whitespace-nowrap px-3 py-2 text-center text-sm">
        {product.categories.map(category => (
          <p key={category.id}>{category.name}</p>
        ))}
      </td>
      <td className="px-3 py-2 text-center text-sm">{product.stock}</td>
      <td className="whitespace-nowrap px-3 py-2 text-right">
        <div>
          <p className={product.hasDiscount ? 'text-xs line-through dark:text-gray-400' : ''}>
            {currencyFormat(product.price)}
          </p>
          {product.hasDiscount && product.priceWithDiscount ? <p>{currencyFormat(product.priceWithDiscount)}</p> : null}
        </div>
      </td>
      <td className="px-3 py-2 pr-6 text-sm">
        <div className="flex justify-end gap-x-2">
          <button
            className="rounded-full border-2 border-blue-600 border-opacity-50 p-2 text-blue-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
            onClick={() => mount(product)}
          >
            <IconEdit size={16} stroke={3} />
          </button>

          <button
            className="rounded-full border-2 border-red-600 border-opacity-50 p-2 text-red-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
            onClick={() => onDelete(product)}
          >
            <IconTrash size={16} stroke={3} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableItem;
