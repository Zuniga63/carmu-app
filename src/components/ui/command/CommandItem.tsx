'use client';

import { cn } from '@/utils';
import { forwardRef } from 'react';

import { Command as CommandPrimitive } from 'cmdk';

type CommandItemElement = React.ElementRef<typeof CommandPrimitive.Item>;
type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;

const CommandItem = forwardRef<CommandItemElement, CommandItemProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50`,
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;
export { CommandItem };
