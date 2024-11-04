'use client';

import { cn } from '@/utils';

type Props = React.HTMLAttributes<HTMLSpanElement>;

const CommandShortcut = ({ className, ...props }: Props) => {
  return <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;
};

CommandShortcut.displayName = 'CommandShortcut';

export { CommandShortcut };
