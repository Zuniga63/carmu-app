'use client';

import { forwardRef } from 'react';

import { Command as CommandPrimitive } from 'cmdk';

type CommandEmptyElement = React.ElementRef<typeof CommandPrimitive.Empty>;
type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> & {};

const CommandEmpty = forwardRef<CommandEmptyElement, CommandEmptyProps>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export { CommandEmpty };
