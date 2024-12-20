'use client';

import { cn } from '@/utils';
import { forwardRef } from 'react';

import { Command as CommandPrimitive } from 'cmdk';
import { IconSearch } from '@tabler/icons-react';

type CommandInputElement = React.ElementRef<typeof CommandPrimitive.Input>;
type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {};

const CommandInput = forwardRef<CommandInputElement, CommandInputProps>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <IconSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

export { CommandInput };
