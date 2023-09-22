import { Button, Modal } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  isOpen: boolean;
  children?: ReactNode;
  onClose: () => void;
  onPrint: () => void;
};

export default function ModalContainer({ isOpen, children, onClose, onPrint }: Props) {
  return (
    <Modal opened={isOpen} onClose={onClose} title="Imprimir Factura" size="xl">
      <div className="mb-4 flex gap-x-2">{children}</div>

      <div className="flex justify-center">
        <Button onClick={onPrint}>Imprimir</Button>
      </div>
    </Modal>
  );
}
