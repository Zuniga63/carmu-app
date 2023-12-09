import BrandLogo from './BrandLogo';
import BurgerToggle from './BurgerToggle';
import DarkButtom from './DarkButton';
import NavDrawer from './NavDrawer';
import UserAvatar from './UserAvatar';
import HeaderContainer from './HeaderContainer';
import HeaderBoundary from './HeaderBoundary';
import HeaderDesktopNav from './HeaderDesktopNav';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';

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
      <HeaderContainer>
        <HeaderBoundary>
          <BurgerToggle opened={drawerOpened} onClick={toggle} />
          <BrandLogo />
        </HeaderBoundary>

        <h2 className="text-base font-bold tracking-wider sm:text-lg md:text-2xl lg:hidden">{title}</h2>

        <HeaderDesktopNav />

        <HeaderBoundary>
          <DarkButtom />
          <UserAvatar />
        </HeaderBoundary>
      </HeaderContainer>

      <NavDrawer opened={drawerOpened} toggle={toggle} />
    </>
  );
}
