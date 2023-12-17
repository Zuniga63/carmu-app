import React from 'react';
import { Button } from '../ui/Button';
import { IconMenu2, IconX } from '@tabler/icons-react';

interface Props {
  opened: boolean;
  onClick: () => void;
}

export default function BurgerToggle({ opened, onClick }: Props) {
  const title = opened ? 'Close navigation' : 'Open navigation';

  return (
    <Button size={'icon'} variant={'ghost'} onClick={onClick} title={title} className="xl:hidden">
      {opened ? <IconX size={20} /> : <IconMenu2 size={20} />}
    </Button>
  );
}
