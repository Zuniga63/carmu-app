'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';
import { forwardRef } from 'react';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      isRequired: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      },
    },
  },
);

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>;
type LabelElement = React.ElementRef<typeof LabelPrimitive.Root>;

const Label = forwardRef<LabelElement, LabelProps>(({ className, isRequired = false, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ isRequired }), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
