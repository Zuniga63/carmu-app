import { Loader } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { ReactNode } from 'react';

type Props = {
  isVisible?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  children?: ReactNode;
};

export default function CategoryDragAndDropMessage({ isVisible, isLoading, isSuccess, isError, children }: Props) {
  if (!isVisible) return null;

  return (
    <div className={`flex gap-x-2 ${isSuccess && 'text-green-500'} ${isError && 'text-red-500'}`}>
      {isLoading && <Loader size="xs" />}
      {isSuccess && <IconCircleCheck size={16} />}
      {isError && <IconCircleX size={16} />}
      <span className={`text-xs text-opacity-90 ${isSuccess && 'text-green-500'} ${isError && 'text-red-500'}`}>
        {children}
      </span>
    </div>
  );
}
