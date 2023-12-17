import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

const DarkButtom = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Button
      variant="outline"
      size={'icon'}
      className={cn({ 'text-yellow-500': dark, 'text-blue-500': !dark })}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </Button>
  );
};

export default DarkButtom;
