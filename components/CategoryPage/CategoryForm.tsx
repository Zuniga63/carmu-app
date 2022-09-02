import React, { FormEvent, useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Drawer, Textarea, TextInput } from '@mantine/core';
import { IconDatabase, IconX } from '@tabler/icons';
import { IValidationErrors } from 'types';
import CustomButton from 'components/CustomButton';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { hideCategoryForm, storeNewCategory, updateCategory } from 'store/reducers/CategoryPage/creators';

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
  } = useAppSelector(state => state.CategoryPageReducer);
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
    /* const headers = { 'Content-Type': 'multipart/form-data' };
    const url = isUpdate ? `/categories/${categoryToUpdate?.id}` : '/categories';
    const method = isUpdate ? 'PUT' : 'POST';
    let isSuscces = false; */

    if (categoryToUpdate) dispatch(updateCategory(categoryToUpdate, formData));
    else dispatch(storeNewCategory(formData));

    /*  setLoading(true); */

    try {
      /* const res = await axios({ url, data: reqData, method, headers });
      const { category: categoryData } = res.data as { category: Category };
      onSuccess(categoryData, isUpdate);
      isSuscces = true; */
    } catch (error) {
      /* if (error instanceof AxiosError) {
        const { response } = error;
        if (response?.data) {
          if (response.status === 422) {
            if (response.data.validationErrors) setErrors(response.data.validationErrors);
          } else if (response.status === 401) {
            toast.error(response.data.message);
          } else {
            console.log(error);
          }
        }
      } else {
        console.log(error);
      } */
    } finally {
      /* setLoading(false);
      if (isSuscces) close(); */
    }
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
      if (updateIsSuccess) toast.success(`La categoría "${categoryToUpdate?.name}" fue actualizada`);
      else toast.success('¡Categoría guardada con éxito!');
      close();
    }
  }, [storeIsSuccess, updateIsSuccess]);

  useEffect(() => {
    let error: unknown = null;

    if (updateError) error = updateError;
    else if (storeError) error = storeError;

    if (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        if (response?.data) {
          if (response.status === 422) {
            if (response.data.validationErrors) setErrors(response.data.validationErrors);
          } else if (response.status === 401) {
            toast.error(response.data.message);
          } else {
            console.log(error);
          }
        }
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
        <header className="sticky top-0 z-fixed bg-header text-gray-200">
          <div className="flex h-16 items-center justify-between px-4 py-2">
            <h2 className="text-lg font-bold uppercase">
              {!isUpdate ? <span>Nueva Categoría</span> : <span>{categoryToUpdate?.name}</span>}
            </h2>
            <button onClick={close}>
              <IconX size={32} />
            </button>
          </div>
        </header>
        <form onSubmit={submitHandler} className="relative h-full overflow-y-auto bg-defaul-body pt-8 pb-40 text-light">
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
              <span className="animate-pulse text-xs text-slate-200">{isUpdate ? 'Actualizando' : 'Guardando'}...</span>
            )}
            <CustomButton disabled={loading} type="submit">
              <div className="flex items-center gap-x-2">
                <IconDatabase size={16} />{' '}
                <span className="text-base">{isUpdate ? <span>Actualizar</span> : <span>Guardar</span>}</span>
              </div>
            </CustomButton>
          </footer>
        </form>
      </>
    </Drawer>
  );
}
