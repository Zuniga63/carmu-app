import Link from 'next/link';
import { cn } from '@/utils';

type Props = {
  label: string;
  path: string;
  isActive: boolean;
  icon: React.ReactNode;
};

export default function HeaderDesktopNavLink({ label, path, isActive, icon }: Props) {
  return (
    <li
      className={cn('text-dark transition-colors dark:text-light', { 'text-blue-600 dark:text-yellow-400': isActive })}
    >
      <Link
        href={path}
        passHref
        className="flex items-center gap-x-2 px-6 py-4 text-2xl transition-colors duration-200 hover:text-purple-600 dark:hover:text-amber-500 xl:py-3 xl:text-base"
      >
        {icon}
        <span className="font-bold tracking-wide">{label}</span>
      </Link>
    </li>
  );
}
