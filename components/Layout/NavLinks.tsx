import React, { useEffect, useState } from 'react';
import { IconDashboard, IconCategory, IconBox } from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  close?: () => void;
}

export default function NavLinks({ close }: Props) {
  const [links, setLinks] = useState([
    {
      id: 1,
      name: 'Dashboard',
      path: '/',
      active: false,
      icon: <IconDashboard size={32} stroke={1.5} className="flex-shrink-0" />,
    },
    {
      id: 2,
      name: 'Categorías',
      path: '/admin/categories',
      active: false,
      icon: <IconCategory size={32} stroke={1.5} className="flex-shrink-0" />,
    },
    {
      id: 3,
      name: 'Cajas',
      path: '/admin/boxes',
      active: false,
      icon: <IconBox size={32} stroke={1.5} className="flex-shrink-0" />,
    },
  ]);

  const router = useRouter();

  useEffect(() => {
    setLinks(current =>
      current.map(item => {
        if (item.path === router.asPath) item.active = true;
        return item;
      })
    );
  }, [router]);

  const clickHandler = () => {
    if (close) {
      setTimeout(() => {
        close();
      }, 100);
    }
  };
  return (
    <nav>
      <ul className="text-light">
        {links.map(link => (
          <li key={link.id} className={!link.active ? 'text-light' : 'bg-btn-bg text-blue-600'}>
            <Link href={link.path} passHref>
              <a
                className="flex items-center gap-x-2 px-6 py-4 text-2xl transition-colors duration-200 hover:bg-slate-200 hover:text-dark active:bg-slate-200 active:text-dark xl:py-3 xl:text-base"
                onClick={clickHandler}
              >
                {link.icon}
                <span className="font-bold tracking-wide">{link.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
