import React, { useEffect, useState } from 'react';
import { IconDashboard, IconBox, IconUsers, IconBuildingStore, IconFileInvoice } from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  close?: () => void;
}

export const Links = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/',
    active: false,
    Icon: IconDashboard,
  },
  {
    id: 3,
    name: 'Cajas',
    path: '/admin/boxes',
    active: false,
    Icon: IconBox,
  },
  {
    id: 4,
    name: 'Clientes',
    path: '/admin/customers',
    active: false,
    Icon: IconUsers,
  },
  {
    id: 5,
    name: 'Productos',
    path: '/admin/products',
    active: false,
    Icon: IconBuildingStore,
  },
  {
    id: 6,
    name: 'Facturación',
    path: '/admin/invoices',
    active: false,
    Icon: IconFileInvoice,
  },
];

export default function NavLinks({ close }: Props) {
  const [links, setLinks] = useState(Links);

  const router = useRouter();

  useEffect(() => {
    setLinks(current =>
      current.map(item => {
        item.active = item.path === router.asPath;
        return item;
      }),
    );
  }, [router.asPath]);

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
          <li
            key={link.id}
            className={
              !link.active
                ? 'text-dark dark:text-light'
                : 'bg-blue-100 text-blue-600 dark:bg-btn-bg dark:text-yellow-400'
            }
          >
            <Link
              href={link.path}
              passHref
              className="flex items-center gap-x-2 px-6 py-4 text-2xl transition-colors duration-200 hover:bg-slate-200 hover:text-dark active:bg-slate-200 active:text-dark xl:py-3 xl:text-base"
              onClick={clickHandler}
            >
              <link.Icon size={32} stroke={1.5} className="flex-shrink-0" />
              <span className="font-bold tracking-wide">{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
