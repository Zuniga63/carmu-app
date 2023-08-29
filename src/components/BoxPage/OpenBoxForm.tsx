import { FormEvent, useEffect, useState } from 'react';
import { Button, Modal, NumberInput } from '@mantine/core';
import { IconLockOpen } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { boxPageSelector, unmountBoxToOpen, openBox } from 'src/features/BoxPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IValidationErrors } from 'src/types';
import { currencyFormat } from 'src/utils';

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
  } = useAppSelector(boxPageSelector);
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
    if (box && typeof base === 'number' && base >= 0) {
      const data = { boxId: box.id, base };
      dispatch(openBox(data));
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
      const { data, status } = error;
      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    }
  }, [error]);

  useEffect(() => {
    if (typeof base === 'number' && base >= 0) setEnabled(true);
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
            min={0}
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
