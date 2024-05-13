import Link from 'next/link';
import { Menu } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconCategory, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';

import { useAuthStore } from '@/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

export default function UserAvatar() {
  const user = useAuthStore(state => state.user);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const clearCredentials = useAuthStore(state => state.clearCredentials);

  const userInitials = user?.name
    .split(' ', 2)
    .map(name => name[0])
    .join('');

  const router = useRouter();

  const logoutHandle = () => {
    clearCredentials();
    router.push('/login');
  };

  return (
    <Menu shadow="xl" transition="pop-top-right" transitionDuration={150}>
      <Menu.Target>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.profilePhoto?.url} alt={user?.name} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="mb-2 px-2">
          <p className="text-center text-sm font-bold">{user?.name}</p>
          {isAdmin && (
            <p className="scale-90 text-center text-xs italic tracking-wider text-dark dark:text-gray-200">
              Administrador
            </p>
          )}
          <p className="scale-90 text-center text-sm text-dark dark:text-gray-100">{user?.email}</p>
        </div>
        <Menu.Divider />
        <Menu.Item component={Link} icon={<IconUser size={16} />} href="/admin/profile">
          Perfil de usuario
        </Menu.Item>
        <Menu.Item icon={<IconSettings size={16} />} component={Link} href="/admin/config">
          Configuraciones
        </Menu.Item>
        <Menu.Item icon={<IconCategory size={18} />}>
          <Link href="/admin/categories">Administrar Categorías</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" onClick={logoutHandle} icon={<IconLogout size={16} />}>
          Cerrar Sesión
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
