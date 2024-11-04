'use client';

import { HTMLInputTypeAttribute } from 'react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { cn } from '@/utils';
import InputWrapper from './InputWrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/Input';

type TextInputProps<
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
  type?: HTMLInputTypeAttribute;
};

export function FormTextInput<
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
  type = 'text',
  ...props
}: TextInputProps<TFieldValues, TName>) {
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
            type={type}
          />
        </InputWrapper>
      )}
    />
  );
}
