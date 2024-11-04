'use client';

import { cn } from '@/utils';
import { forwardRef } from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

type DialogDescriptionElement = React.ElementRef<typeof DialogPrimitive.Description>;
type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

const DialogDescription = forwardRef<DialogDescriptionElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { DialogDescription };
