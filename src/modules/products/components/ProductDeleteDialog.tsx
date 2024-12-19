import { MouseEventHandler, useEffect, useMemo } from 'react';
import { useProductPageStore } from '@/modules/products/stores/product-page.store';
import { useGetAllProducts, useRemoveProduct } from '@/hooks/react-query/product.hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import { IconLoader2 } from '@tabler/icons-react';
import { useToast } from '@/hooks/ui/use-toast';

export function ProductDeleteDialog() {
  const productId = useProductPageStore(state => state.productToDeleteId);
  const closeDialog = useProductPageStore(state => state.hideDeleteDialog);

  const { data: products = [] } = useGetAllProducts();

  const { toast } = useToast();

  const product = useMemo(() => {
    if (!productId) return null;
    return products.find(item => item.id === productId);
  }, [productId]);

  const { mutate, isPending, isSuccess, isError } = useRemoveProduct();

  const handleClose = (value: boolean) => {
    if (isPending || value) return;
    closeDialog();
  };

  const handleConfirm: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    if (isPending || !productId) return;
    mutate(productId);
  };

  const handleCancel = () => {
    if (isPending) return;
    closeDialog();
  };

  useEffect(() => {
    if (!isSuccess) return;
    closeDialog();
    toast({ description: '¡Producto Eliminado!' });
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;
    closeDialog();
    toast({ description: 'No se pudo eliminar el producto, intentalo nuevamente', variant: 'destructive' });
  }, [isError]);

  return (
    <AlertDialog open={Boolean(productId)} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estas seguro que desea eliminar este producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el producto <strong>{product?.name}</strong> y no es reversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {isPending ? (
              <>
                <IconLoader2 className="mr-4 inline-block h-4 w-4 animate-spin" /> Eliminando...
              </>
            ) : (
              'Si, hazlo'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
