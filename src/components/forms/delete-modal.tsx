import { Button, Modal } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

type Props = {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export default function DeleteModal({ title, isOpen, isLoading, onClose, onConfirm, children }: Props) {
  return (
    <Modal opened={isOpen} onClose={onClose} size="sm" withCloseButton={false} radius="lg" padding="md">
      <header className="mb-4">
        <div className="ea mb-2 flex justify-center">
          <IconAlertCircle size={80} className="text-yellow-400" />
        </div>
        <h2 className="text-center text-xl">{title}</h2>
      </header>

      <section className="mb-6 text-center">{children}</section>

      <div className="flex justify-between">
        <Button color="green" disabled={isLoading} onClick={onClose}>
          Cancelar
        </Button>

        <Button color="red" loading={isLoading} onClick={onConfirm}>
          {isLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </Modal>
  );
}
