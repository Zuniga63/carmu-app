import Link from 'next/link';
import { IconCategory, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';

import { useAuthStore } from '@/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { signOut } from 'next-auth/react';

export default function UserAvatar() {
  const user = useAuthStore(state => state.user);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const clearCredentials = useAuthStore(state => state.clearCredentials);

  const userInitials = user?.name
    .split(' ', 2)
    .map(name => name[0])
    .join('');

  const logoutHandle = () => {
    clearCredentials();
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.profilePhoto?.url} alt={user?.name} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="mb-2 px-2">
          <p className="text-center text-sm font-bold">{user?.name}</p>
          {isAdmin && (
            <p className="scale-90 text-center text-xs italic tracking-wider text-dark dark:text-gray-200">
              Administrador
            </p>
          )}
          <p className="scale-90 text-center text-sm text-dark dark:text-gray-100">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin/profile" className="flex gap-x-2">
              <IconUser size={16} />
              Perfil de usuario
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin/config" className="flex gap-x-2">
              <IconSettings size={16} />
              Configuraciones
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin/categories" className="flex gap-x-2">
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
