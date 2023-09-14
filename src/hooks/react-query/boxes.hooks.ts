import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { getAllBoxes } from '@/services/boxes.service';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';

export function useGetAllBoxes() {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.Boxes],
    queryFn: getAllBoxes,
    enabled: isAuth,
  });
}
