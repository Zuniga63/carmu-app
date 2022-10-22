import { IconEdit, IconTrash } from '@tabler/icons';
import React from 'react';
import { IProduct } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  product: IProduct;
  mount(customer: IProduct): void;
  onDelete(customer: IProduct): Promise<void>;
}

const ProductTableItem = ({ product, mount, onDelete }: Props) => {
  return (
    <tr className="text-gray-300">
      <td className="whitespace-nowrap px-3 py-2">
        <div className="text-center">
          <p>{product.name}</p>
          {Boolean(product.ref) && (
            <p className="text-sm">
              <span>ref</span>: {product.ref}
            </p>
          )}
          {Boolean(product.barcode) && (
            <p className="text-sm">
              <span>Codigo</span>: {product.barcode}
            </p>
          )}
        </div>
      </td>
      <td className="px-3 py-2 text-center text-sm">
        <p>{product.description}</p>
        <p>Categorias: {product.categories.length}</p>
      </td>
      <td className="px-3 py-2 text-center text-sm">{product.stock}</td>
      <td className={`px-3 py-2 text-right text-sm`}>{currencyFormat(product.price)}</td>
      <td className="px-3 py-2 text-sm">
        <div className="flex justify-end gap-x-2">
          <button className="rounded-full border-2 border-blue-600 border-opacity-50 p-2 text-blue-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100">
            <IconEdit size={16} stroke={3} onClick={() => mount(product)} />
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
