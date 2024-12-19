import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import {
  createProduct,
  getAllLiteProducts,
  getAllProducts,
  removePropduct,
  updateProduct,
} from '@/modules/products/services';
import { useAuthStore } from '@/store/auth-store';
import type { IProductWithCategories } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

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

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: data => {
      queryClient.setQueryData([ServerStateKeysEnum.Products], (oldData: IProductWithCategories[] | undefined) => {
        if (!oldData) return oldData;
        return [data, ...oldData];
      });

      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.ProductList] });
      toast.success('Producto creado');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: data => {
      queryClient.setQueryData([ServerStateKeysEnum.Products], (oldData: IProductWithCategories[] | undefined) => {
        if (!oldData) return oldData;
        const productCopy = oldData.map(product => (product.id === data.id ? data : product));
        return productCopy;
      });

      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.ProductList] });
      toast.success('Producto actualizado');
    },
  });
}
