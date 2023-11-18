import { Button, Modal, NumberInput } from '@mantine/core';
import { IconLockOpen } from '@tabler/icons-react';
import { useOpenBoxForm } from '@/hooks/boxes-page/use-open-box-form';

const OpenBoxForm = () => {
  const { isOpen, base, cashbox, enabled, errors, isLoading, setBase, submitHandler, closeHandler } = useOpenBoxForm();

  return (
    <Modal opened={isOpen} onClose={closeHandler} size="sm">
      <form onSubmit={submitHandler}>
        <header>
          <h2 className="text-center text-xl font-bold">{cashbox?.name}</h2>
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
          <Button leftIcon={<IconLockOpen />} loading={isLoading} type="submit" disabled={!enabled}>
            Abrir Caja
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default OpenBoxForm;
