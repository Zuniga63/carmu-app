import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Drawer } from '@mantine/core';
import BrandLogo from './BrandLogo';
import BurgerToggle from './BurgerToggle';

interface Props {
  opened: boolean;
  toggle: () => void;
}

export default function NavDrawer({ opened, toggle }: Props) {
  //---------------------------------------------------------------------------
  // STATE
  //---------------------------------------------------------------------------
  const largeScreen = useMediaQuery('(min-width: 768px)');

  //---------------------------------------------------------------------------
  // METHODS AND EFFECTS
  //---------------------------------------------------------------------------
  const close = () => {
    if (opened) toggle();
  };

  return (
    <Drawer opened={opened} onClose={close} padding={0} size={largeScreen ? 'md' : '100%'} withCloseButton={false}>
      <>
        <header className="sticky top-0 z-fixed bg-header text-gray-200">
          <nav className="flex h-16 items-center justify-between px-4 py-2">
            <BrandLogo />
            <BurgerToggle opened={opened} onClick={close} />
          </nav>
        </header>
        <div className="relative h-full overflow-y-auto bg-defaul-body pb-40">foo</div>
      </>
    </Drawer>
  );
}
