'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { IconCategory, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';

import { useAppStore } from '@/stores/app-store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ROUTES = {
  PROFILE: '/admin/profile',
  CONFIG: '/admin/config',
  CATEGORIES: '/admin/categories',
} as const;

export function UserAvatar() {
  const user = useAppStore(state => state.user);
  const clearCredentials = useAppStore(state => state.clearCredentials);

  const userInitials = user?.name
    ? user.name
        .split(' ', 2)
        .map(name => name[0])
        .join('')
    : '?';

  const logoutHandle = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      clearCredentials();
      signOut();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.profilePhoto} alt={user?.name} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="mb-2 px-2">
          <p className="text-center text-sm font-bold">{user?.name}</p>
          {user?.isSuperUser && (
            <p className="scale-90 text-center text-xs italic tracking-wider text-dark dark:text-gray-200">
              Administrador
            </p>
          )}
          <p className="scale-90 text-center text-sm text-dark dark:text-gray-100">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={ROUTES.PROFILE} className="flex gap-x-2">
              <IconUser size={16} />
              Perfil de usuario
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={ROUTES.CONFIG} className="flex gap-x-2">
              <IconSettings size={16} />
              Configuraciones
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={ROUTES.CATEGORIES} className="flex gap-x-2">
              <IconCategory size={18} />
              Administrar Categorías
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex cursor-pointer gap-x-2 text-red-500" onClick={logoutHandle}>
          <IconLogout size={16} />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
