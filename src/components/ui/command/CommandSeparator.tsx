'use client';

import { cn } from '@/utils';
import { forwardRef } from 'react';

import { Command as CommandPrimitive } from 'cmdk';

type CommandSeparatorElement = React.ElementRef<typeof CommandPrimitive.Separator>;
type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> & {};

const CommandSeparator = forwardRef<CommandSeparatorElement, CommandSeparatorProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn('-mx-1 h-px bg-border', className)} {...props} />
));

CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

export { CommandSeparator };
