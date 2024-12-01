'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils';

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function MainNavLink({ children, href, className, ...props }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors text-muted-foreground hover:text-primary',
        { 'text-primary': isActive },
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
