import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Separator } from '@radix-ui/react-dropdown-menu';

const DropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
DropdownMenuSeparator.displayName = Separator.displayName;

export { DropdownMenuSeparator };
