import { Modal, ModalProps } from '@mantine/core';
import { ReactNode } from 'react';
import InvoiceFormHeader from './InvoiceFormHeader';

type Props = {
  isOpen: boolean;
  children?: ReactNode;
  size?: ModalProps['size'];
  onClose: () => void;
};

export default function InvoiceFormModal({ isOpen, size, children, onClose }: Props) {
  return (
    <Modal opened={isOpen} onClose={onClose} padding={0} withCloseButton={false} size={size}>
      <InvoiceFormHeader onClose={onClose} isSeparate={false} />
      {children}
    </Modal>
  );
}
