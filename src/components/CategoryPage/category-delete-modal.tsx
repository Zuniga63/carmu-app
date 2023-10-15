import DeleteModal from '../forms/delete-modal';
import { useCategoryDeleteModal } from '@/hooks/category-page/use-category-delete-modal';

export default function CategoryDeleteModal() {
  const { isOpen, category, isLoading, closeModal, confirm } = useCategoryDeleteModal();

  const handleClose = () => closeModal();
  const handleConfirm = () => confirm();

  return (
    <DeleteModal
      title={`¿Seguro que deseas eliminar ${category?.name}?`}
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    >
      Esta acción eliminará la refenrancia en la base de datos de todos los productos asociados y no puede revertirse
    </DeleteModal>
  );
}
