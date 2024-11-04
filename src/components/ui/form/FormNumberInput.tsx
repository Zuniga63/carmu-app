'use client';

import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/Input';
import { cn } from '@/utils';
import InputWrapper from './InputWrapper';

type NumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  placeholder?: string;
  description?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
  isRequired?: boolean;
  min?: InputProps['min'];
  max?: InputProps['max'];
  step?: InputProps['step'];
};

export function FormNumberInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  leftSection,
  rightSection,
  description,
  className,
  isRequired,
  min,
  max,
  step,
  ...props
}: NumberInputProps<TFieldValues, TName>) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <InputWrapper
          label={label}
          description={description}
          leftSection={leftSection}
          rightSection={rightSection}
          className={className}
          isRequired={isRequired}
        >
          <Input
            placeholder={placeholder}
            {...field}
            className={cn({ 'pl-10': Boolean(leftSection), 'pr-10': Boolean(rightSection) })}
            min={min}
            max={max}
            step={step}
            type="number"
          />
        </InputWrapper>
      )}
    />
  );
}
