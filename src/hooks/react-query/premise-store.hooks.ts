import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { getAllPremiseStore, storePremiseStore, updatePremiseStore } from '@/services/premise-store.service';
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetAllPremiseStore() {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.PremiseStore],
    queryFn: getAllPremiseStore,
    enabled: isAuth,
    staleTime: Infinity,
  });
}

export function useCreatePremiseStore() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: storePremiseStore,
    onSuccess() {
      cache.invalidateQueries([ServerStateKeysEnum.PremiseStore]);
    },
  });
}

export function useUpdatePremiseStore() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: updatePremiseStore,
    onSuccess() {
      cache.invalidateQueries([ServerStateKeysEnum.PremiseStore]);
    },
  });
}
