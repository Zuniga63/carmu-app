import { IProductWithCategories } from '@/types';
import React from 'react';
import DeleteModal from '../forms/delete-modal';

type Props = {
  product?: IProductWithCategories | null;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ProductDeleteDialog({ product, isLoading, onConfirm, onCancel }: Props) {
  return (
    <DeleteModal
      title="¿Seguro que desea eliminar el producto?"
      isOpen={Boolean(product)}
      onClose={onCancel}
      onConfirm={onConfirm}
      isLoading={isLoading}
    >
      El producto <strong>{product?.name}</strong> será eliminado de la plataforma, esta acción no es reversible.
    </DeleteModal>
  );
}
