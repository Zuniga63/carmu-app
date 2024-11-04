'use client';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@/utils';
import { forwardRef } from 'react';

type CommandElement = React.ElementRef<typeof CommandPrimitive>;
type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {};

const Command = forwardRef<CommandElement, CommandProps>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;
export { Command };
