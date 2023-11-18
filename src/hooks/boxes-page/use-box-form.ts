import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IValidationErrors } from '@/types';
import { useCreateBox } from '@/hooks/react-query/boxes.hooks';
import axios from 'axios';
import { useBoxesPageStore } from '@/store/boxes-page-store';

export function useBoxForm() {
  const isOpen = useBoxesPageStore(state => state.formIsOpen);
  const hideForm = useBoxesPageStore(state => state.hideForm);

  const [name, setName] = useState('');
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const { mutate: createBox, isPending: isLoading, isSuccess, isError, error } = useCreateBox();

  const closeHandler = () => {
    if (isLoading) return;

    setName('');
    setErrors(null);
    hideForm();
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createBox({ name });
  };

  useEffect(() => {
    if (!isSuccess) return;

    toast.success(`¡La caja ${name} fue creada con éxito!`);
    setName('');
    hideForm();
  }, [isSuccess]);

  useEffect(() => {
    if (!error || !isError) return;

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      }
    } else {
      console.log(error);
    }
  }, [isError, error]);

  return {
    isOpen,
    name,
    errors,
    isLoading,
    setName,
    closeHandler,
    submitHandler,
  };
}
