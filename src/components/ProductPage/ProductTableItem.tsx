import { IconEdit, IconTrash } from '@tabler/icons-react';
import React from 'react';
import { IProductWithCategories } from '@/types';
import { currencyFormat } from '@/utils';
import { useProductPageStore } from '@/store/product-page.store';

interface Props {
  product: IProductWithCategories;
}

const ProductTableItem = ({ product }: Props) => {
  const mountToEdit = useProductPageStore(state => state.showForm);
  const mountToDelete = useProductPageStore(state => state.showDeleteDialog);

  const handleToEdit = () => mountToEdit(product.id);
  const handleToDelete = () => mountToDelete(product.id);

  return (
    <tr className="text-gray-dark dark:text-light">
      <td className="whitespace-nowrap px-3 py-2 lg:whitespace-normal">
        <div className="text-center lg:text-left">
          <p className="text-sm font-bold uppercase">{product.name}</p>
          <p className="text-xs text-gray-400">{product.description}</p>
          {product.isInventoriable && <p className="text-xs italic">Es inventariable</p>}
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
      <td className="whitespace-nowrap px-3 py-2 text-right">{product.productSize}</td>
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
            onClick={handleToEdit}
          >
            <IconEdit size={16} stroke={3} />
          </button>

          <button
            className="rounded-full border-2 border-red-600 border-opacity-50 p-2 text-red-600 text-opacity-50 transition-colors hover:border-opacity-80 hover:text-opacity-80 active:border-opacity-100 active:text-opacity-100"
            onClick={handleToDelete}
          >
            <IconTrash size={16} stroke={3} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableItem;
