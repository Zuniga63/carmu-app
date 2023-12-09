import { useRouter } from 'next/router';
import { Links } from './NavLinks';
import { useEffect, useState } from 'react';
import HeaderDesktopNavLink from './HeaderDesktopNavLink';

export default function HeaderDesktopNav() {
  const router = useRouter();
  const [links, setLinks] = useState(Links);

  useEffect(() => {
    setLinks(current =>
      current.map(item => {
        item.active = item.path === router.asPath;
        return item;
      }),
    );
  }, [router.asPath]);

  return (
    <nav className="hidden flex-grow px-8 lg:block">
      <ul className="flex gap-x-2">
        {links.map(link => (
          <HeaderDesktopNavLink
            key={link.id}
            label={link.name}
            isActive={link.active}
            path={link.path}
            icon={<link.Icon size={24} stroke={1.5} className="flex-shrink-0" />}
          />
        ))}
      </ul>
    </nav>
  );
}
