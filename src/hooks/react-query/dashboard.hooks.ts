import { getCashReports } from '@/services/dashboard.service';
import { useAuthStore } from '@/store/auth-store';
import { useConfigStore } from '@/store/config-store';
import { useQuery } from '@tanstack/react-query';

export function useGetCashReports() {
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isUnlock = useConfigStore(state => state.showSensitiveInformation);

  return useQuery({
    queryKey: ['cash-report'],
    queryFn: getCashReports,
    enabled: isAdmin && isUnlock,
  });
}
