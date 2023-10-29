import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { getAllLiteProducts, getAllProducts } from '@/services/product.service';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';

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
