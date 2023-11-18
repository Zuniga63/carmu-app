import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import {
  closeCashbox,
  createBox,
  getAllBoxes,
  getMainTransactions,
  getMinorTransactions,
  openBox,
  removeBox,
  removeMainTransaction,
  removeMinorTransaction,
  storeMainTransaction,
  storeMinorTransaction,
} from '@/services/boxes.service';
import { useAuthStore } from '@/store/auth-store';
import { IBoxesResponse, ITransactionResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetAllBoxes() {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.Boxes],
    queryFn: getAllBoxes,
    enabled: isAuth,
  });
}

export function useGetMinorTransactions({ boxId, enabled = false }: { boxId?: string; enabled?: boolean }) {
  const isAuth = useAuthStore(state => state.isAuth);

  return useQuery({
    queryKey: [ServerStateKeysEnum.BoxTransaction, boxId],
    queryFn: () => getMinorTransactions({ boxId: boxId || '' }),
    enabled: typeof boxId !== 'undefined' && isAuth && enabled,
  });
}

export function useGetMainTransactions({ enabled = false }: { enabled?: boolean }) {
  const isAuth = useAuthStore(state => state.isAuth);
  const isAdmin = useAuthStore(state => state.isAdmin);

  return useQuery({
    queryKey: [ServerStateKeysEnum.MainTransactions],
    queryFn: getMainTransactions,
    enabled: isAuth && isAdmin && enabled,
  });
}

export function useCreateBox() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: createBox,
    onSuccess(data, variables, context) {
      cache.setQueryData([ServerStateKeysEnum.Boxes], (oldData: IBoxesResponse): IBoxesResponse => {
        return {
          ...oldData,
          boxes: [data.cashbox, ...oldData.boxes],
        };
      });
    },
  });
}

export function useDeleteBox() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: removeBox,
    onSuccess(data, boxId, context) {
      cache.setQueryData([ServerStateKeysEnum.Boxes], (oldData: IBoxesResponse): IBoxesResponse => {
        return {
          ...oldData,
          boxes: oldData.boxes.filter(box => box.id !== boxId),
        };
      });
    },
  });
}

export function useOpenBox() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: openBox,
    onSuccess(data) {
      cache.setQueryData([ServerStateKeysEnum.Boxes], (oldData: IBoxesResponse): IBoxesResponse => {
        return {
          ...oldData,
          boxes: oldData?.boxes.map(box => {
            if (box.id === data.id) return data;
            return box;
          }),
        };
      });
    },
  });
}

export function useCloseCashbox() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: closeCashbox,
    onSuccess(data) {
      cache.setQueryData([ServerStateKeysEnum.Boxes], (oldData: IBoxesResponse): IBoxesResponse => {
        return {
          ...oldData,
          boxes: oldData?.boxes.map(box => {
            if (box.id === data.id) return data;
            return box;
          }),
        };
      });
    },
  });
}

export function useCreateMinorTransaction() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: storeMinorTransaction,
    onSuccess(data, { boxId }, context) {
      cache.setQueryData([ServerStateKeysEnum.Boxes], (oldData: IBoxesResponse): IBoxesResponse => {
        const newBoxes = oldData.boxes.map(box => {
          if (box.id !== boxId) return box;

          return {
            ...box,
            balance: (box.balance || 0) + data.amount,
          };
        });

        return {
          ...oldData,
          boxes: newBoxes,
        };
      });

      cache.setQueryData([ServerStateKeysEnum.BoxTransaction, boxId], (oldData: ITransactionResponse[] | null) => {
        if (!oldData) return null;
        return [...oldData, data];
      });
    },
  });
}

export function useCreateMainTransaction() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: storeMainTransaction,
    onSuccess(data, variable, context) {
      cache.invalidateQueries({ queryKey: [ServerStateKeysEnum.Boxes] });

      cache.setQueryData([ServerStateKeysEnum.MainTransactions], (oldData: ITransactionResponse[] | null) => {
        if (!oldData) return null;
        return [...oldData, data];
      });
    },
  });
}

export function useRemoveMinorTransaction() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: removeMinorTransaction,
    onSuccess(data, { boxId }, context) {
      cache.setQueryData([ServerStateKeysEnum.Boxes], (oldData: IBoxesResponse): IBoxesResponse => {
        const newBoxes = oldData.boxes.map(box => {
          if (box.id !== boxId) return box;

          return {
            ...box,
            balance: (box.balance || 0) - data.amount,
          };
        });

        return {
          ...oldData,
          boxes: newBoxes,
        };
      });

      cache.setQueryData([ServerStateKeysEnum.BoxTransaction, boxId], (oldData: ITransactionResponse[] | null) => {
        if (!oldData) return null;
        return oldData.filter(transaction => transaction.id !== data.id);
      });
    },
  });
}

export function useRemoveMainTransaction() {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: removeMainTransaction,
    onSuccess(data, transactionId, context) {
      cache.invalidateQueries({ queryKey: [ServerStateKeysEnum.Boxes] });

      cache.setQueryData([ServerStateKeysEnum.MainTransactions], (oldData: ITransactionResponse[] | null) => {
        if (!oldData) return null;
        return oldData.filter(transaction => transaction.id !== data.id);
      });
    },
  });
}
