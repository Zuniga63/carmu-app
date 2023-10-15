import { useEffect, useState } from 'react';
import { useGetAllCategories, useUpdateCategoryOrder } from '@/hooks/react-query/categories.hooks';
import { useCategoryPageStore } from '@/store/categories-store';
import { useQueryClient } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';

export function useCategoryDragAndDrop() {
  const showCreateForm = useCategoryPageStore(state => state.showForm);

  const [isBrowser, setIsBrowser] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const queryClient = useQueryClient();
  const { data: categories = [] } = useGetAllCategories();
  const { mutate: updateCategoryOrder, isLoading, isSuccess, isError } = useUpdateCategoryOrder();

  const reorderList = (fromIndex: number, toIndex: number) => {
    const result = categories.slice();
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    queryClient.setQueriesData([ServerStateKeysEnum.Categories], result);

    const categoryIds = result.map(({ id }) => id);
    updateCategoryOrder({ categoryIds });
  };

  useEffect(() => {
    setIsBrowser(typeof window !== undefined);
  }, []);

  useEffect(() => {
    const isChange = isSuccess || isError;
    if (!isChange) return;

    if (isSuccess) setMessage('Orden guardado.');
    if (isError) setMessage('No se pudo guardar');
    setShowMessage(true);

    const id = setTimeout(() => setShowMessage(false), 3000);
    return () => clearTimeout(id);
  }, [isSuccess, isError]);

  return { isBrowser, message, showMessage, isLoading, isSuccess, isError, categories, reorderList, showCreateForm };
}
