import { cn } from '@/utils/cn';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function ProductPageContainer({ className, children }: Props) {
  return <div className={cn('grid h-full grid-cols-4', className)}>{children}</div>;
}
