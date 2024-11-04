'use client';

import { cn } from '@/utils';
import { forwardRef } from 'react';

import { Command as CommandPrimitive } from 'cmdk';

type CommandListElement = React.ElementRef<typeof CommandPrimitive.List>;
type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> & {};

const CommandList = forwardRef<CommandListElement, CommandListProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

export { CommandList };
