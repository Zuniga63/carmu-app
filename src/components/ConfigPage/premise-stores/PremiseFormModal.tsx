import { Button, Modal, Select, TextInput } from '@mantine/core';
import { IconBox } from '@tabler/icons';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { boxPageSelector } from 'src/features/BoxPage';
import {
  configSelector,
  hidePremiseForm,
  storePremiseStore,
  updatePremiseStore,
} from 'src/features/Config';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IValidationErrors } from 'src/types';

const PremiseFormModal = () => {
  const {
    premiseFormOpened: opened,
    premiseFormLoading: loading,
    premiseFormIsSuccess: isSuccess,
    premiseFormError: error,
    commercialPremiseToUpdate: commercialToUpdate,
  } = useAppSelector(configSelector);
  const { boxes } = useAppSelector(boxPageSelector);
  const dispatch = useAppDispatch();

  const [modalTitle, setModalTitle] = useState('Agregar Local Comercial');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultBox, setDefaultBox] = useState<string | null>(null);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const close = () => {
    if (!loading) {
      dispatch(hidePremiseForm());
      setName('');
      setAddress('');
      setPhone('');
      setDefaultBox(null);
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name) {
      if (commercialToUpdate) {
        dispatch(
          updatePremiseStore({
            storeId: commercialToUpdate.id,
            name,
            address: address || undefined,
            phone: phone || undefined,
            defaultBox: defaultBox || undefined,
          })
        );
      } else {
        dispatch(
          storePremiseStore({
            name,
            address: address || undefined,
            phone: phone || undefined,
            defaultBox: defaultBox || undefined,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (commercialToUpdate) {
        toast.success('¡Local comercial actualizado!');
      } else {
        toast.success('¡Local comercial registrado!');
      }
      close();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (commercialToUpdate) {
      setModalTitle('Actualizar local comercial');
      const { name, address, phone, defaultBox } = commercialToUpdate;
      setName(name);
      setAddress(address || '');
      setPhone(phone || '');

      const box = boxes.find(item => item.id === defaultBox?.id);
      if (box) {
        setDefaultBox(box.id);
      }
    } else {
      setModalTitle('Agregar local comercial');
    }
  }, [commercialToUpdate]);

  useEffect(() => {
    if (error) {
      const { data, status } = error;
      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401 || status === 404) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    }
  }, [error]);

  return (
    <Modal opened={opened} onClose={close} title={modalTitle}>
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
          <Button size="xs" color="red" onClick={close} disabled={loading}>
            Cancelar
          </Button>
          <Button size="xs" color="green" loading={loading} type="submit">
            Guardar
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default PremiseFormModal;
