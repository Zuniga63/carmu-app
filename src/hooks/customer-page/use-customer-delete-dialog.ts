import { useDeleteCustomer, useGetAllCustomers } from '@/hooks/react-query/customers.hooks';
import { useCustomerPageStore } from '@/store/customer-store';
import type { ICustomer } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function useCustomerDeleteDialog() {
  const { data: customers = [] } = useGetAllCustomers();
  const { mutate: deleteCustomer, isSuccess, isPending, isError } = useDeleteCustomer();

  const customerId = useCustomerPageStore(state => state.customerToDelete);
  const closeDialog = useCustomerPageStore(state => state.hideDeleteCustomerAlert);

  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState<ICustomer | null>(null);

  const closeModal = () => {
    if (isPending) return;

    setIsOpen(false);
    setCustomer(null);
    setTimeout(closeDialog, 150);
  };

  const confirm = () => {
    if (!customerId) return;
    deleteCustomer(customerId);
  };

  useEffect(() => {
    const customer = customers.find(({ id }) => id === customerId);

    if (!customer) {
      closeDialog();
      return;
    }

    setIsOpen(true);
    setCustomer(customer);
  }, [customerId]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.success('¡Cliente eliminado!');
    closeModal();
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;
    toast.error('¡No se pudo eliminar, intentalo nuevamente!');
  }, [isError]);

  return {
    isOpen,
    customer,
    isLoading: isPending,
    closeModal,
    confirm,
  };
}
