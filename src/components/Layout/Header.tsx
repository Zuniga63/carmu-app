import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import BrandLogo from './BrandLogo';
import BurgerToggle from './BurgerToggle';
import DarkButtom from './DarkButton';
import NavDrawer from './NavDrawer';
import { Links } from './NavLinks';
import UserAvatar from './UserAvatar';

interface Props {
  title?: string;
}

export default function Header({ title }: Props) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const largeScreen = useMediaQuery('(min-width: 1280px)');
  const router = useRouter();
  const [links, setLinks] = useState(Links);

  const toggle = () => setDrawerOpened(current => !current);

  useEffect(() => {
    if (largeScreen) setDrawerOpened(false);
  }, [largeScreen]);

  useEffect(() => {
    setLinks(current =>
      current.map(item => {
        item.active = item.path === router.asPath;
        return item;
      })
    );
  }, [router.asPath]);

  return (
    <>
      <header
        className="sticky top-0 z-fixed bg-neutral-200 text-dark dark:bg-header dark:text-light xl:static"
        id="layout-header"
      >
        <div className="flex items-center justify-between px-4 py-2 md:px-6 xl:py-3">
          <div className="flex items-center gap-x-2 md:gap-x-4">
            <BurgerToggle opened={drawerOpened} onClick={toggle} />
            <BrandLogo />
          </div>
          <h2 className="text-base font-bold tracking-wider sm:text-xl md:text-2xl lg:hidden">
            {title}
          </h2>
          <nav className="hidden flex-grow px-8 lg:block">
            <ul className="flex gap-x-2">
              {links.map(link => (
                <li
                  key={link.id}
                  className={
                    link.active
                      ? 'text-blue-600 dark:text-yellow-400'
                      : 'text-dark dark:text-light' + ' transition-colors'
                  }
                >
                  <Link
                    href={link.path}
                    passHref
                    className="flex items-center gap-x-2 px-6 py-4 text-2xl transition-colors duration-200 hover:text-purple-600 dark:hover:text-amber-500 xl:py-3 xl:text-base"
                  >
                    <link.Icon
                      size={24}
                      stroke={1.5}
                      className="flex-shrink-0"
                    />
                    <span className="font-bold tracking-wide">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-x-4">
            <DarkButtom />
            <UserAvatar />
          </div>
        </div>
      </header>

      <NavDrawer opened={drawerOpened} toggle={toggle} />
    </>
  );
}
