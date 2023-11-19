import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { getAllLiteProducts, getAllProducts, removePropduct } from '@/services/product.service';
import { useAuthStore } from '@/store/auth-store';
import type { IProductWithCategories } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type GetAllLiteProductOptions = {
  staleTime?: number;
};

export function useGetAllLiteProducts(options?: GetAllLiteProductOptions) {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.ProductList],
    queryFn: getAllLiteProducts,
    enabled: isAuth,
    staleTime: options?.staleTime || Infinity,
  });
}

export function useGetAllProducts() {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.Products],
    queryFn: getAllProducts,
    enabled: isAuth,
  });
}

export function useRemoveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePropduct,
    onSuccess: (data, productId) => {
      queryClient.setQueryData([ServerStateKeysEnum.Products], (oldData: IProductWithCategories[] | undefined) => {
        if (!oldData) return oldData;
        const productCopy = oldData.filter(product => product.id !== productId);
        return productCopy;
      });
    },
  });
}
