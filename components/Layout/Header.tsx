import { useMediaQuery } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import BrandLogo from './BrandLogo';
import BurgerToggle from './BurgerToggle';
import NavDrawer from './NavDrawer';
import UserAvatar from './UserAvatar';

interface Props {
  title?: string;
}

export default function Header({ title }: Props) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const largeScreen = useMediaQuery('(min-width: 1280px)');

  const toggle = () => setDrawerOpened(current => !current);

  useEffect(() => {
    if (largeScreen) setDrawerOpened(false);
  }, [largeScreen]);

  return (
    <>
      <header className="sticky top-0 z-fixed bg-header text-light xl:static" id="layout-header">
        <div className="flex items-center justify-between px-4 py-2 md:px-6 xl:py-3">
          <div className="flex items-center gap-x-2 md:gap-x-4">
            <BurgerToggle opened={drawerOpened} onClick={toggle} />
            <BrandLogo />
          </div>
          <h2 className="text-base font-bold tracking-wider sm:text-xl md:text-2xl">{title}</h2>
          <UserAvatar />
        </div>
      </header>

      <NavDrawer opened={drawerOpened} toggle={toggle} />
    </>
  );
}
