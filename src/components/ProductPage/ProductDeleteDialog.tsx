import { useEffect, useMemo } from 'react';
import DeleteModal from '../forms/delete-modal';
import { useProductPageStore } from '@/store/product-page.store';
import { useGetAllProducts, useRemoveProduct } from '@/hooks/react-query/product.hooks';
import { toast } from 'react-toastify';

export default function ProductDeleteDialog() {
  const productId = useProductPageStore(state => state.productToDeleteId);
  const closeDialog = useProductPageStore(state => state.hideDeleteDialog);

  const { data: products = [] } = useGetAllProducts();

  const product = useMemo(() => {
    if (!productId) return null;
    return products.find(item => item.id === productId);
  }, [productId]);

  const { mutate, isPending, isSuccess, isError } = useRemoveProduct();

  const handleClose = () => {
    if (isPending) return;
    closeDialog();
  };

  const handleConfirm = () => {
    if (isPending || !productId) return;
    mutate(productId);
  };

  useEffect(() => {
    if (!isSuccess) return;
    closeDialog();
    toast.success('¡Producto Eliminado!');
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;
    closeDialog();
    toast.error('No se pudo eliminar el producto, intentalo nuevamente');
  }, [isError]);

  return (
    <DeleteModal
      title="¿Seguro que desea eliminar el producto?"
      isOpen={Boolean(productId)}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isPending}
    >
      El producto <strong>{product?.name}</strong> será eliminado de la plataforma, esta acción no es reversible.
    </DeleteModal>
  );
}
