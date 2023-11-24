import { AnnualReportParams } from '@/components/dashboard/AnnualReportStatistics';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import {
  getAnnualReportStatistics,
  getCashReports,
  getCreditEvolution,
  getWeeklyInvoiceHistory,
} from '@/services/dashboard.service';
import { useAuthStore } from '@/store/auth-store';
import { useConfigStore } from '@/store/config-store';
import { useQueries, useQuery } from '@tanstack/react-query';

export function useGetCashReports() {
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isUnlock = useConfigStore(state => state.showSensitiveInformation);

  return useQuery({
    queryKey: [ServerStateKeysEnum.CashReport],
    queryFn: getCashReports,
    enabled: isAdmin && isUnlock,
  });
}

export function useGetCreditEvolution() {
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isUnlock = useConfigStore(state => state.showSensitiveInformation);

  return useQuery({
    queryKey: [ServerStateKeysEnum.CreditEvolution],
    queryFn: getCreditEvolution,
    enabled: isAdmin && isUnlock,
  });
}

export function useGetAnnualReports(params: AnnualReportParams[]) {
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isUnlock = useConfigStore(state => state.showSensitiveInformation);

  const result = useQueries({
    queries: params.map(queryParams => ({
      queryKey: [ServerStateKeysEnum.AnnualReports, queryParams],
      queryFn: () => getAnnualReportStatistics(queryParams),
      enabled: isAdmin && isUnlock,
      staleTime: Infinity,
    })),
  });

  const isLoading = result.some(query => query.isLoading);

  return {
    reports: result.map(query => query.data).filter(report => typeof report !== 'undefined'),
    isLoading,
  };
}

export function useGetWeeklyInvoiceHistory() {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.InvoiceWeeklyHistory],
    queryFn: getWeeklyInvoiceHistory,
    enabled: isAuth,
  });
}
