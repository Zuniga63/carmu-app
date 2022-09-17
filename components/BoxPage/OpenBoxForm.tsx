import { Button, Modal, NumberInput } from '@mantine/core';
import { IconLockOpen } from '@tabler/icons';
import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { openBox, unmountBoxToOpen } from 'store/reducers/BoxPage/creators';
import { IValidationErrors } from 'types';
import { currencyFormat } from 'utils';

const OpenBoxForm = () => {
  const [opened, setOpened] = useState(false);
  const [base, setBase] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const {
    boxToOpen: box,
    openBoxIsSuccess: isSuccess,
    openBoxError: error,
    openBoxLoading: loading,
  } = useAppSelector(state => state.BoxPageReducer);
  const dispatch = useAppDispatch();

  const closeHandler = () => {
    if (!loading) {
      setErrors(null);
      setOpened(false);
      setTimeout(() => {
        dispatch(unmountBoxToOpen());
      }, 150);
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (box && base) {
      const data = { base };
      dispatch(openBox(box, data));
    }
  };

  useEffect(() => {
    if (box) setOpened(true);
    else setOpened(false);
  }, [box]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Caja abierta con una base de ${currencyFormat(base)}`);
      closeHandler();
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

  useEffect(() => {
    if (base && base > 100) setEnabled(true);
    else setEnabled(false);
  }, [base]);

  return (
    <Modal opened={opened} onClose={closeHandler} size="sm">
      <form onSubmit={submitHandler}>
        <header>
          <h2 className="text-center text-xl font-bold"> {box?.name}</h2>
        </header>
        <div className="mb-2">
          <NumberInput
            label="Base"
            required
            placeholder="Escribe la base aquí"
            hideControls
            min={100}
            step={100}
            value={base}
            onChange={value => setBase(value)}
            error={errors?.base?.message}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={value => {
              if (value) {
                return !Number.isNaN(parseFloat(value)) ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ ';
              }

              return '$ ';
            }}
          />
        </div>
        <footer className="flex items-center justify-end">
          <Button leftIcon={<IconLockOpen />} loading={loading} type="submit" disabled={!enabled}>
            Abrir Caja
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default OpenBoxForm;
