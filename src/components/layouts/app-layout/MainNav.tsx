import { cn } from '@/utils';
import Link from 'next/link';
import { MainNavLink } from './MainNavLink';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export function MainNav({ className, ...props }: Props) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6 flex-1', className)} {...props}>
      <MainNavLink href="/">Dashboard</MainNavLink>
      <MainNavLink href="/admin/boxes">Cajas</MainNavLink>
      <MainNavLink href="/admin/customers">Clientes</MainNavLink>
      <MainNavLink href="/admin/products">Productos</MainNavLink>
      <MainNavLink href="/admin/invoices">Facturación</MainNavLink>
    </nav>
  );
}
