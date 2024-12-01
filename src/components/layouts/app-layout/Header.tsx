import { cn } from "@/utils";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export function Header({ className, children }: Props) {
  return (
    <header className={cn('sticky top-0 z-50 border-b backdrop-blur-sm', className)}>
      <div className="flex h-16 items-center px-8">
        {children}
      </div>
    </header>
  );
}
