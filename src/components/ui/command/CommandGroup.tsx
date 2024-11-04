'use client';

import { cn } from '@/utils';
import { forwardRef } from 'react';

import { Command as CommandPrimitive } from 'cmdk';

type CommandGroupElement = React.ElementRef<typeof CommandPrimitive.Group>;
type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> & {};

const CommandGroup = forwardRef<CommandGroupElement, CommandGroupProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

export { CommandGroup };
