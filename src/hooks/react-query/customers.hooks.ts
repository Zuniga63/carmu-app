import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import {
  getAllCustomers,
  createNewCustomer,
  updateCustomer,
  deleteCustomer,
  createCustomerPayment,
  getCustomerById,
} from '@/services/customers.service';
import { useAuthStore } from '@/store/auth-store';
import { ICustomer } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type GetAllCustomerOptions = {
  staleTime?: number;
};

export function useGetAllCustomers(options?: GetAllCustomerOptions) {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.Customers],
    queryFn: getAllCustomers,
    enabled: isAuth,
    staleTime: options?.staleTime,
  });
}

export function useCreateNewCustomer() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: createNewCustomer,
    onSuccess(data, variables, context) {
      cache.setQueryData([ServerStateKeysEnum.Customers], (oldData: ICustomer[]) => [...oldData, data]);
    },
  });
}

export function useUpdateCustomer() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess(data, variables, context) {
      const updatedCustomer = data;
      const oldData = cache.getQueryData<ICustomer[]>([ServerStateKeysEnum.Customers]);
      if (!oldData) return;

      const updatedData = oldData.map(customer => {
        if (customer.id === updatedCustomer.id) {
          return updatedCustomer;
        }
        return customer;
      });
      cache.setQueryData([ServerStateKeysEnum.Customers], updatedData);
    },
  });
}

export function useDeleteCustomer() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess(data, customerId, context) {
      if (!data.ok) return;
      const oldData = cache.getQueryData<ICustomer[]>([ServerStateKeysEnum.Customers]);
      if (!oldData) return;

      const updatedData = oldData.filter(customer => customer.id !== customerId);
      cache.setQueryData([ServerStateKeysEnum.Customers], updatedData);
    },
  });
}

export function useAddCustomerPayment() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: createCustomerPayment,
    onSuccess(data, customerId, context) {
      cache.invalidateQueries({ queryKey: [ServerStateKeysEnum.Customers] });
    },
  });
}

export function useGetCustomerById({ id }: { id?: string }) {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.Customers, id],
    queryFn: () => getCustomerById(id || ''),
    enabled: isAuth && typeof id === 'string',
  });
}
