import React, { FormEvent, useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Drawer, Textarea, TextInput } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import { IValidationErrors } from '@/types';
import CustomButton from '@/components/CustomButton';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import DrawerHeader from '@/components/DrawerHeader';
import DrawerBody from '@/components/DrawerBody';
import {
  categoryPageSelector,
  hideCategoryForm,
  setStoreIsSuccess,
  setUpdateIsSuccess,
  storeCategory,
  updateCategory,
} from '@/features/CategoryPage';

export default function CategoryForm() {
  //---------------------------------------------------------------------------
  // STATE
  //---------------------------------------------------------------------------
  const {
    categoryToUpdate,
    formIsLoading: loading,
    formOpened: opened,
    storeError,
    updateError,
    storeIsSuccess,
    updateIsSuccess,
  } = useAppSelector(categoryPageSelector);
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const largeScreen = useMediaQuery('(min-width: 768px)');

  //---------------------------------------------------------------------------
  // METHODS
  //---------------------------------------------------------------------------
  const close = () => {
    if (!loading) {
      setName('');
      setDescription(undefined);
      setErrors(null);
      dispatch(hideCategoryForm());
    }
  };

  const backdropClose = () => {
    if (!name && !description && !loading) dispatch(hideCategoryForm());
  };

  const getData = (): FormData => {
    const data = new FormData();
    data.append('name', name);
    if (description) data.append('description', description);
    return data;
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = getData();

    if (categoryToUpdate) {
      const arg = { category: categoryToUpdate, data: formData };
      dispatch(updateCategory(arg));
    } else dispatch(storeCategory(formData));
  };

  //---------------------------------------------------------------------------
  // USE EFFECTS
  //---------------------------------------------------------------------------
  useEffect(() => {
    if (categoryToUpdate) {
      setName(categoryToUpdate.name);
      setDescription(categoryToUpdate.description);
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
  }, [categoryToUpdate]);

  useEffect(() => {
    if (storeIsSuccess || updateIsSuccess) {
      if (updateIsSuccess) {
        toast.success(`La categoría "${categoryToUpdate?.name}" fue actualizada`);
        dispatch(setUpdateIsSuccess(false));
      } else {
        toast.success('¡Categoría guardada con éxito!');
        dispatch(setStoreIsSuccess(false));
      }
      close();
    }
  }, [storeIsSuccess, updateIsSuccess]);

  useEffect(() => {
    let error: unknown = null;

    if (updateError) error = updateError;
    else if (storeError) error = storeError;

    if (error) {
      const { data, status } = error as AxiosResponse;
      if (status === 422) {
        if (data.validationErrors) setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    }
  }, [updateError, storeError]);

  return (
    <Drawer
      opened={opened}
      onClose={backdropClose}
      padding={0}
      size={largeScreen ? 'md' : '100%'}
      withCloseButton={false}
      position="left"
    >
      <>
        <DrawerHeader title={!isUpdate ? 'Nueva Categoría' : String(categoryToUpdate?.name)} onClose={close} />
        <DrawerBody>
          <form onSubmit={submitHandler}>
            <div className="mx-auto mb-4 w-11/12">
              <TextInput
                label={<span className="font-sans text-light">Nombre</span>}
                placeholder="Escribe el nombre aquí."
                id="categoryName"
                required
                value={name}
                onChange={({ target }) => setName(target.value)}
                disabled={loading}
                error={errors?.name?.message}
              />

              <Textarea
                label={<span className="font-sans text-light">Descripción</span>}
                placeholder="Escribe una descripción aqui."
                value={description}
                onChange={({ target }) => setDescription(target.value)}
                disabled={loading}
                error={errors?.description?.message}
              ></Textarea>
            </div>
            <footer className="flex items-center justify-end gap-x-2 px-4 py-2">
              {loading && (
                <span className="animate-pulse text-xs text-slate-200">
                  {isUpdate ? 'Actualizando' : 'Guardando'}...
                </span>
              )}
              <CustomButton disabled={loading} type="submit">
                <div className="flex items-center gap-x-2">
                  <IconDatabase size={16} />{' '}
                  <span className="text-base">{isUpdate ? <span>Actualizar</span> : <span>Guardar</span>}</span>
                </div>
              </CustomButton>
            </footer>
          </form>
        </DrawerBody>
      </>
    </Drawer>
  );
}
