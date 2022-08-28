import React from 'react';
import { Burger, useMantineTheme } from '@mantine/core';

interface Props {
  opened: boolean;
  onClick: () => void;
}

export default function BurgerToggle({ opened, onClick }: Props) {
  const title = opened ? 'Close navigation' : 'Open navigation';
  const theme = useMantineTheme();

  return <Burger opened={opened} onClick={onClick} title={title} color={theme.colors.gray[2]} className="xl:hidden" />;
}
