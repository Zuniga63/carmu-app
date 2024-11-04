'use client';

import { cn } from '@/utils';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import MultipleSelector, { Option } from '../MultipleSelector';

type FormMultipleSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  isRequired?: boolean;
  options?: Option[];
  onSelect?: (value: string | number) => void;
};

export function FormMultipleSelector<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  description,
  className,
  isRequired,
  options = [],
  onSelect,
  ...props
}: FormMultipleSelectorProps<TFieldValues, TName>) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
          <FormControl>
            <MultipleSelector
              value={field.value}
              onChange={field.onChange}
              options={options}
              placeholder={placeholder}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">No encontrada.</p>
              }
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
