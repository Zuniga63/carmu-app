import { useCustomerDeleteDialog } from '@/hooks/customer-page/use-customer-delete-dialog';
import DeleteModal from '../forms/delete-modal';

export default function CustomerDeleteDialog() {
  const { isOpen, customer, isLoading, closeModal, confirm } = useCustomerDeleteDialog();

  const handleClose = () => closeModal();
  const handleConfirm = () => confirm();

  return (
    <DeleteModal
      title={`¿Seguro que deseas eliminar  al cliente ${customer?.fullName}?`}
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    >
      Está accion eliminará todas la referencias del cliente en la base de datos y no es reversible.
    </DeleteModal>
  );
}
