import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Label } from '@radix-ui/react-dropdown-menu';

const DropdownMenuLabel = forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} {...props} />
));
DropdownMenuLabel.displayName = Label.displayName;

export { DropdownMenuLabel };
