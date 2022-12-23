import React from 'react';
import { Burger } from '@mantine/core';

interface Props {
  opened: boolean;
  onClick: () => void;
}

export default function BurgerToggle({ opened, onClick }: Props) {
  const title = opened ? 'Close navigation' : 'Open navigation';

  return (
    <Burger
      opened={opened}
      onClick={onClick}
      title={title}
      className="xl:hidden"
    />
  );
}
