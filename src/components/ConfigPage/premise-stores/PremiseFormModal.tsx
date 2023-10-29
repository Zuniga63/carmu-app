import { Button, Modal, Select, TextInput } from '@mantine/core';
import { IconBox } from '@tabler/icons-react';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IBox, IValidationErrors } from '@/types';
import { useConfigStore } from '@/store/config-store';
import {
  useCreatePremiseStore,
  useGetAllPremiseStore,
  useUpdatePremiseStore,
} from '@/hooks/react-query/premise-store.hooks';
import axios from 'axios';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';

const PremiseFormModal = () => {
  const { data: boxesResponse } = useGetAllBoxes();
  const boxes: IBox[] = boxesResponse?.boxes || [];

  const isOpen = useConfigStore(state => state.premiseStoreFormOpened);
  const premiseStoreIdToUpdate = useConfigStore(state => state.premiseStoreIdToUpdate);
  const { data: premiseStores } = useGetAllPremiseStore();

  const closeForm = useConfigStore(state => state.hidePremiseStoreForm);

  const [modalTitle, setModalTitle] = useState('Agregar Local Comercial');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultBox, setDefaultBox] = useState<string | null>(null);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const {
    mutate: createPremiseStore,
    isPending: createIsLoading,
    isError: createIsError,
    isSuccess: createIsSuccess,
    error: createError,
  } = useCreatePremiseStore();

  const {
    mutate: updatePremiseStore2,
    isPending: updateIsLoading,
    isError: updateIsError,
    isSuccess: updateIsSuccess,
    error: updateError,
  } = useUpdatePremiseStore();

  const close = () => {
    if (createIsLoading || updateIsLoading) return;
    closeForm();
    setName('');
    setAddress('');
    setPhone('');
    setDefaultBox(null);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (createIsLoading || updateIsLoading || !name) return;

    if (premiseStoreIdToUpdate) {
      updatePremiseStore2({
        storeId: premiseStoreIdToUpdate,
        name,
        address: address || undefined,
        phone: phone || undefined,
        defaultBox: defaultBox || undefined,
      });
    } else {
      createPremiseStore({
        name,
        address: address || undefined,
        phone: phone || undefined,
        defaultBox: defaultBox || undefined,
      });
    }
  };

  useEffect(() => {
    const isSuccess = createIsSuccess || updateIsSuccess;
    if (!isSuccess) return;

    const message = premiseStoreIdToUpdate ? '¡Local comercial actualizado!' : '¡Local comercial registrado!';
    toast.success(message);
    close();
  }, [createIsSuccess, updateIsSuccess]);

  useEffect(() => {
    if (!premiseStoreIdToUpdate || !premiseStores) return;

    const premiseStore = premiseStores.find(item => item.id === premiseStoreIdToUpdate);
    if (!premiseStore) {
      close();
      setModalTitle('Agregar local comercial');
      return;
    }

    setModalTitle('Actualizar local comercial');
    const { name, address, phone, defaultBox } = premiseStore;
    setName(name);
    setAddress(address || '');
    setPhone(phone || '');

    const box = boxes.find(item => item.id === defaultBox?.id);
    if (box) {
      setDefaultBox(box.id);
    }
  }, [premiseStoreIdToUpdate]);

  useEffect(() => {
    const error = createError || updateError;
    if (!error) return;

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401 || status === 404) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    }
  }, [createIsError, updateIsError]);

  return (
    <Modal opened={isOpen} onClose={close} title={modalTitle}>
      <form onSubmit={submitHandler}>
        <div className="mb-6">
          <TextInput
            label="Nombre"
            placeholder="Escribe el nombre del local"
            value={name}
            onChange={({ currentTarget }) => setName(currentTarget.value)}
            required
            size="xs"
            error={errors?.name.message}
          />

          <TextInput
            label="Dirección"
            placeholder="Escribe la dirección"
            value={address}
            onChange={({ currentTarget }) => setAddress(currentTarget.value)}
            size="xs"
          />

          <TextInput
            label="Teléfono"
            placeholder="Escribe el numero aquí"
            value={phone}
            onChange={({ currentTarget }) => setPhone(currentTarget.value)}
            type="tel"
            size="xs"
          />

          <Select
            label="Caja por defecto"
            placeholder="Caja a registrar el abono"
            value={defaultBox}
            onChange={setDefaultBox}
            icon={<IconBox size={14} />}
            data={boxes.map(box => ({
              value: box.id,
              label: box.name,
            }))}
            searchable
            clearable
            size="xs"
          />
        </div>
        <footer className="flex justify-between">
          <Button size="xs" color="red" onClick={close} disabled={createIsLoading || updateIsLoading}>
            Cancelar
          </Button>
          <Button size="xs" color="green" loading={createIsLoading || updateIsLoading} type="submit">
            Guardar
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default PremiseFormModal;
