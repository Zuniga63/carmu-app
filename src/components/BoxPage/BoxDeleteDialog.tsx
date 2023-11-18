import DeleteModal from '@/components/forms/delete-modal';
import { useBoxDeleteDialog } from '@/hooks/boxes-page/use-box-delete-dialog';

export default function BoxDeleteDialog() {
  const { isOpen, cashbox, isLoading, closeModal, confirm } = useBoxDeleteDialog();

  const handleClose = () => closeModal();
  const handleConfirm = () => confirm();

  return (
    <DeleteModal
      title={`¿Seguro que deseas eliminar  la caja ${cashbox?.name}?`}
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    >
      Está accion eliminará todas la referencias de la caja base de datos y no es reversible.
    </DeleteModal>
  );
}
