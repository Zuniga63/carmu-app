import {
  useGetMainTransactions,
  useGetMinorTransactions,
  useRemoveMainTransaction,
  useRemoveMinorTransaction,
} from '@/hooks/react-query/boxes.hooks';
import { useBoxesPageStore } from '@/store/boxes-page-store';
import { ITransactionResponse } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DeleteModal from '../forms/delete-modal';

export function useTransactionDeleteDialog() {
  const isMainBox = useBoxesPageStore(state => state.mainBoxIsSelected);
  const boxSelected = useBoxesPageStore(state => state.boxToInfo);
  const transactionId = useBoxesPageStore(state => state.transactionToDelete);
  const hideDialog = useBoxesPageStore(state => state.unmountTransactionToDelete);

  const { data: mainTransactions } = useGetMainTransactions({
    enabled: isMainBox && typeof transactionId === 'undefined',
  });
  const { data: minorTransactions } = useGetMinorTransactions({
    boxId: boxSelected,
    enabled: !isMainBox && typeof transactionId !== 'undefined',
  });

  const {
    mutate: deleteMinor,
    isPending: minorIsPending,
    isSuccess: minorIsSuccess,
    isError: minorIsError,
    reset: minorReset,
  } = useRemoveMinorTransaction();
  const {
    mutate: deleteMain,
    isPending: mainIsPending,
    isSuccess: mainIsSuccess,
    isError: mainIsError,
    reset: mainReset,
  } = useRemoveMainTransaction();

  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState<ITransactionResponse | null>(null);

  const confirm = () => {
    if (minorIsPending || mainIsPending || !transactionId) return;

    if (isMainBox) {
      deleteMain(transactionId);
    } else if (boxSelected) {
      deleteMinor({ transactionId, boxId: boxSelected });
    }
  };

  const closeModal = () => {
    if (minorIsPending || mainIsPending) return;

    setIsOpen(false);
    setTransaction(null);
    hideDialog();
    minorReset();
    mainReset();
  };

  useEffect(() => {
    const transactions = (isMainBox ? mainTransactions : minorTransactions) || [];
    const tranactionToDelete = transactions.find(t => t.id === transactionId);
    if (tranactionToDelete) {
      setTransaction(tranactionToDelete);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [transactionId]);

  useEffect(() => {
    const isSusccess = minorIsSuccess || mainIsSuccess;
    if (!isSusccess) return;

    toast.success('¡Transacción Eliminada!');
    closeModal();
  }, [minorIsSuccess, mainIsSuccess]);

  useEffect(() => {
    if (!minorIsError || mainIsError) return;
    toast.error('¡No se pudo eliminar, intentalo nuevamente!');
    closeModal();
  }, [minorIsError, mainIsError]);

  return { isOpen, transaction, confirm, closeModal, isLoading: minorIsPending || mainIsPending };
}

export default function TransactionDeleteDialog() {
  const { isOpen, transaction, isLoading, closeModal, confirm } = useTransactionDeleteDialog();

  const handleClose = () => closeModal();
  const handleConfirm = () => confirm();

  return (
    <DeleteModal
      title={`¿Seguro que deseas eliminar  la transacción "${transaction?.description}"?`}
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    >
      Esta acción es irreversible.
    </DeleteModal>
  );
}
