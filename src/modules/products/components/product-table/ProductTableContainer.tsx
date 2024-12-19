import { cn } from '@/utils/cn';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function ProductTableContainer({ className, children }: Props) {
  return (
    <div className={cn('mx-auto flex h-full flex-col dark:text-light bg-neutral-950', className)}>
      <div className="flex h-full w-full flex-col">{children}</div>
    </div>
  );
}
