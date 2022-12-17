import { Button, Modal, TextInput } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons';
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { closeCreateForm, storeBox } from 'src/store/reducers/BoxPage/creators';
import { IValidationErrors } from 'src/types';

const CreateForm = () => {
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const {
    createFormOpened: opened,
    storeBoxLoading: loading,
    storeBoxIsSuccess: isSuccess,
    storeBoxError: error,
  } = useAppSelector(state => state.BoxPageReducer);

  const dispatch = useAppDispatch();

  //---------------------------------------------------------------------------
  // EFFECTS
  //---------------------------------------------------------------------------
  useEffect(() => {
    if (name && name.length) setEnabled(true);
    else setEnabled(false);
  }, [name]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(`¡La caja ${name} fue creada con éxito!`);
      setName('');
      dispatch(closeCreateForm());
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        const data = response?.data;

        if (data) {
          if (response.status === 422 && data.validationErrors) {
            setErrors(data.validationErrors);
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
  }, [error]);

  //---------------------------------------------------------------------------
  // HANDLERS
  //---------------------------------------------------------------------------
  const closeHandler = () => {
    if (!loading) {
      setName('');
      setErrors(null);
      dispatch(closeCreateForm());
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { name };
    dispatch(storeBox(data));
  };

  return (
    <Modal opened={opened} onClose={closeHandler}>
      <form onSubmit={submitHandler}>
        <header>
          <h2>Registrar Una Caja</h2>
        </header>
        <div className="mb-2">
          <TextInput
            label="Nombre"
            placeholder="Escribelo aquí"
            value={name}
            onChange={({ target }) => setName(target.value)}
            disabled={loading}
            error={errors?.name.message}
          />
        </div>
        <footer className="flex items-center justify-end">
          <Button
            leftIcon={<IconDeviceFloppy />}
            loading={loading}
            type="submit"
            disabled={!enabled}
          >
            Guardar
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default CreateForm;
