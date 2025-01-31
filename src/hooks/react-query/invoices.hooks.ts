import axios from 'axios';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import {
  addInvoicePayment,
  cancelInvoice,
  cancelInvoicePayment,
  createInvoice,
  getAllInvoices,
  getInvoiceById,
} from '@/services/invoices.service';
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useGetAllInvoices({ search, invoiceNumber }: { search?: string; invoiceNumber?: string } = {}) {
  const isAuth = useAuthStore(state => state.isAuth);
  const isAdmin = useAuthStore(state => state.isAdmin);

  return useQuery({
    queryKey: [ServerStateKeysEnum.Invoices, search, invoiceNumber],
    queryFn: () => getAllInvoices({ search, invoiceNumber }),
    enabled: isAuth && isAdmin,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.Invoices] });
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.InvoiceWeeklyHistory] });
    },
  });
}

export function useGetInvoiceById(id?: string) {
  const isAuth = useAuthStore(state => state.isAuth);
  const isAdmin = useAuthStore(state => state.isAdmin);

  return useQuery({
    queryKey: [ServerStateKeysEnum.InvoiceId, id],
    queryFn: () => getInvoiceById(id || ''),
    enabled: isAuth && isAdmin && typeof id === 'string',
  });
}

export function useCreateInvoicePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addInvoicePayment,
    onSuccess(data, variables, context) {
      queryClient.setQueryData([ServerStateKeysEnum.InvoiceId, variables.invoiceId], data.invoice);
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.InvoiceWeeklyHistory] });
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.Invoices] });
    },
  });
}

export function useCancelInvoicePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelInvoicePayment,
    onSuccess(data, variables, context) {
      queryClient.setQueryData([ServerStateKeysEnum.InvoiceId, variables.invoiceId], data);
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.InvoiceWeeklyHistory] });
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.Invoices] });

      toast.success('¡Pago anulado!');
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        if (status === 400 || status === 404) {
          toast.error((data as { message: string }).message);
        }
      }
    },
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelInvoice,
    onSuccess(data, variables, context) {
      queryClient.setQueryData([ServerStateKeysEnum.InvoiceId, variables.invoiceId], data);
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.InvoiceWeeklyHistory] });
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.Invoices] });
      toast.success('¡Factura Anulada!');
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        if (status === 400 || status === 404) {
          toast.error((data as { message: string }).message);
        }
      }
    },
  });
}
