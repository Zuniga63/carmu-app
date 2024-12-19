import { IconEdit, IconQrcode, IconTrash } from '@tabler/icons-react';

import { currencyFormat } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { type IProductWithCategories } from '@/types';
import { TableCell, TableRow } from '@/components/ui/TablePro';
import { useProductPageStore } from '@/modules/products/stores/product-page.store';

interface Props {
  product: IProductWithCategories;
}

export function ProductTableItem({ product }: Props) {
  const mountToEdit = useProductPageStore(state => state.showForm);
  const mountToDelete = useProductPageStore(state => state.showDeleteDialog);

  const handleToEdit = () => mountToEdit(product.id);
  const handleToDelete = () => mountToDelete(product.id);
  const mountQrDialog = useProductPageStore(state => state.mountQrDialog);

  return (
    <TableRow className="text-gray-dark dark:text-light">
      <TableCell className="whitespace-nowrap lg:whitespace-normal">
        <div className="text-center lg:text-left">
          <p className="text-sm font-bold uppercase">{product.name}</p>
          <p className="text-xs text-gray-400">{product.description}</p>
          {product.isInventoriable && <p className="text-xs italic">Es inventariable</p>}
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap text-xs">
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
      </TableCell>

      <TableCell className="whitespace-nowrap text-sm">
        {product.categories.map(category => (
          <p key={category.id}>{category.name}</p>
        ))}
      </TableCell>

      <TableCell className="whitespace-nowrap text-center uppercase">{product.productSize}</TableCell>

      <TableCell className="px-3 py-2 text-center text-sm">{product.stock}</TableCell>

      <TableCell className="whitespace-nowrap text-right">
        <p className={product.hasDiscount ? 'text-xs line-through dark:text-gray-400' : ''}>
          {currencyFormat(product.price)}
        </p>
        {product.hasDiscount && product.priceWithDiscount ? <p>{currencyFormat(product.priceWithDiscount)}</p> : null}
      </TableCell>

      <TableCell className="pr-6">
        <div className="flex justify-end gap-x-2">
          <Button size={'icon'} variant={'ghost'} onClick={handleToEdit}>
            <IconEdit size={20} stroke={2} className="text-blue-600" />
          </Button>

          {product.ref && (
            <Button size={'icon'} variant={'ghost'} onClick={() => mountQrDialog(product.ref)}>
              <IconQrcode size={20} stroke={2} className="text-blue-600" />
            </Button>
          )}

          <Button size={'icon'} variant={'ghost'} onClick={handleToDelete}>
            <IconTrash size={16} stroke={2} className="text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
