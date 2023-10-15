import { useDeleteCategory, useGetAllCategories } from '@/hooks/react-query/categories.hooks';
import { useCategoryPageStore } from '@/store/categories-store';
import type { ICategory } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function useCategoryDeleteModal() {
  const { data: categories = [] } = useGetAllCategories();
  const categoryIdToDelete = useCategoryPageStore(state => state.categoryToDelete);
  const cancelDelete = useCategoryPageStore(state => state.cancelDeleteCategory);
  const { mutate: deleteCategory, isLoading, isSuccess, isError } = useDeleteCategory();

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<ICategory | undefined>();

  const closeModal = () => {
    if (isLoading) return;
    setIsOpen(false);
    setTimeout(cancelDelete, 150);
  };

  const confirm = () => {
    if (!categoryIdToDelete) return;
    deleteCategory({ id: categoryIdToDelete });
  };

  useEffect(() => {
    let isOpen = false;
    let category: ICategory | undefined;

    if (categoryIdToDelete) {
      category = categories.find(({ id }) => id === categoryIdToDelete);
      isOpen = Boolean(category);
    }

    if (!isOpen) cancelDelete();
    setCategory(category);
    setIsOpen(isOpen);
  }, [categoryIdToDelete]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.success('¡Categoría eliminada!');
    closeModal();
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;

    toast.error('¡No se pudo eliminar, intentalo nuevamente!');
  }, [isError]);

  return {
    isOpen,
    category,
    isLoading,
    closeModal,
    confirm,
  };
}
