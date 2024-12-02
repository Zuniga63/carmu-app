import { ServerStateKeysEnum } from '@/config/server-state-key.enum';;
import { useAppStore } from '@/stores/app-store';
import { useQuery } from '@tanstack/react-query';
import { getAllPremiseStoreServices } from '../services/get-all-premise-stores.service';

export function useGetAllPremiseStore() {
  const accessToken = useAppStore(state => state.oldAccessToken) ?? '';

  return useQuery({
    queryKey: [ServerStateKeysEnum.PremiseStore, accessToken],
    queryFn: () => getAllPremiseStoreServices({ accessToken }),
    enabled: !!accessToken,
  });
}
