import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { IValidationErrors } from '@/types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCategoryPageStore } from '@/store/categories-store';
import { useGetAllCategories, useStoreNewCategory, useUpdateCategory } from '@/hooks/react-query/categories.hooks';

export function useCategoryForm() {
  const isOpen = useCategoryPageStore(state => state.formOpened);
  const categoryToUpdate = useCategoryPageStore(state => state.categoryToUpdate);
  const hideForm = useCategoryPageStore(state => state.hideForm);
  const { data: categories = [] } = useGetAllCategories();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<IValidationErrors | null>(null);
  const isLargeScreen = useMediaQuery('(min-width: 768px)');

  const {
    mutate: storeCategory,
    isPending: storeIsLoading,
    isSuccess: storeIsSuccess,
    isError: storeIsError,
    error: storeError,
  } = useStoreNewCategory();

  const {
    mutate: updateCategory,
    isPending: updateIsLoading,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
    error: updateError,
  } = useUpdateCategory();

  const updateName = (value: string) => {
    setName(value);
  };

  const updateDescription = (value?: string) => {
    setDescription(value ? value : '');
  };

  const getData = (): FormData => {
    const data = new FormData();
    data.append('name', name.trim());
    if (description) data.append('description', description.trim());

    if (categoryToUpdate) {
      const category = categories.find(({ id }) => id === categoryToUpdate);
      if (category) data.append('order', String(category.order));
    }

    return data;
  };

  const submit = () => {
    if (!name || storeIsLoading) return;

    const data = getData();
    if (!categoryToUpdate) storeCategory(data);
    else updateCategory({ id: categoryToUpdate, data });
  };

  const clearAndClose = () => {
    if (storeIsLoading) return;
    setName('');
    setDescription('');
    hideForm();
  };

  useEffect(() => {
    const category = categories.find(({ id }) => id === categoryToUpdate);
    if (!categoryToUpdate || !category) return;

    setName(category.name);
    setDescription(category.description || '');
  }, [categoryToUpdate]);

  useEffect(() => {
    const isSuccess = storeIsSuccess || updateIsSuccess;
    if (!isSuccess) return;

    if (categoryToUpdate) toast.success(`La categoría "${name}" fue actualizada`);
    else toast.success('¡Categoría guardada con éxito!');

    clearAndClose();
  }, [storeIsSuccess, updateIsSuccess]);

  useEffect(() => {
    const isError = storeIsError || updateIsError;
    const error = storeError || updateError;
    if (!isError) return;

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      if (status === 422) {
        if (data.validationErrors) setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    }
  }, [storeIsError, storeError, updateIsError, updateError]);

  return {
    isOpen,
    name,
    description,
    isLargeScreen,
    isUpdate: Boolean(categoryToUpdate),
    isLoading: storeIsLoading || updateIsLoading,
    errors,
    updateName,
    updateDescription,
    submit,
    closeForm: clearAndClose,
  };
}
