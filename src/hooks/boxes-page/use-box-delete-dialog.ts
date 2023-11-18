import { useDeleteBox, useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { useEffect, useState } from 'react';
import type { IBox } from '@/types';
import { toast } from 'react-toastify';

export function useBoxDeleteDialog() {
  const { data } = useGetAllBoxes();
  const { mutate: deleteBox, isPending, isSuccess, isError } = useDeleteBox();

  const boxId = useBoxesPageStore(state => state.boxToDelete);
  const hideDialog = useBoxesPageStore(state => state.hideDeleteBoxAlert);

  const [isOpen, setIsOpen] = useState(false);
  const [cashbox, setCashbox] = useState<IBox | null>(null);

  const closeModal = () => {
    if (isPending) return;

    setIsOpen(false);
    setCashbox(null);
    setTimeout(hideDialog, 150);
  };

  const confirm = () => {
    if (!boxId) return;
    deleteBox(boxId);
  };

  useEffect(() => {
    const cashboxToDelete = data?.boxes.find(({ id }) => id === boxId);

    if (!cashboxToDelete) {
      hideDialog();
      return;
    }

    setIsOpen(true);
    setCashbox(cashboxToDelete);
  }, [boxId]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.success('Caja eliminada!');
    closeModal();
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;
    toast.error('¡No se pudo eliminar, intentalo nuevamente!');
    closeModal();
  }, [isError]);

  return { isOpen, cashbox, isLoading: isPending, closeModal, confirm };
}
