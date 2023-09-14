import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { getAllCustomers } from '@/services/customers.service';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';

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
