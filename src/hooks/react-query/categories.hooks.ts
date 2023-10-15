import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import {
  deleteCategory,
  getAllCategories,
  storeNewCategory,
  updateCategory,
  updateCategoryOrder,
} from '@/services/categories.service';
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetAllCategories() {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.Categories],
    queryFn: getAllCategories,
    enabled: isAuth,
  });
}

export function useStoreNewCategory() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: storeNewCategory,
    onSuccess(data, variables, context) {
      cache.invalidateQueries([ServerStateKeysEnum.Categories]);
    },
  });
}

export function useUpdateCategory() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess(data, variables, context) {
      cache.invalidateQueries([ServerStateKeysEnum.Categories]);
    },
  });
}

export function useDeleteCategory() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess(data, variables, context) {
      cache.invalidateQueries([ServerStateKeysEnum.Categories]);
    },
  });
}

export function useUpdateCategoryOrder() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryOrder,
    onError(error, variables, context) {
      cache.invalidateQueries([ServerStateKeysEnum.Categories]);
    },
  });
}
