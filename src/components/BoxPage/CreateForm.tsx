import { Button, Modal, TextInput } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useBoxForm } from '@/hooks/boxes-page/use-box-form';

const CreateForm = () => {
  const { isOpen, name, errors, isLoading, setName, closeHandler, submitHandler } = useBoxForm();

  return (
    <Modal opened={isOpen} onClose={closeHandler}>
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
            disabled={isLoading}
            error={errors?.name.message}
          />
        </div>
        <footer className="flex items-center justify-end">
          <Button leftIcon={<IconDeviceFloppy />} loading={isLoading} type="submit" disabled={name.length <= 0}>
            Guardar
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default CreateForm;
