'use client';

import { useState } from 'react';
// import { IconEye, IconEyeOff } from '@tabler/icons-react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { cn } from '@/utils';

import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Button } from '../Button';

import InputWrapper from './InputWrapper';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

type TextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  placeholder?: string;
  description?: string;
  leftSection?: React.ReactNode;
  className?: string;
  isRequired?: boolean;
};

export function FormPasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  leftSection,
  description,
  className,
  isRequired,
  ...props
}: TextInputProps<TFieldValues, TName>) {
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <InputWrapper
          label={label}
          description={description}
          leftSection={leftSection}
          rightSection={
            <Button
              role="show password"
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleClick}
            >
              {show ? (
                <IconEyeOff className="text-inherit" size={20} stroke={'2'} />
              ) : (
                <IconEye className="text-inherit" size={20} stroke={'2'} />
              )}
            </Button>
          }
          className={className}
          isRequired={isRequired}
        >
          <Input
            placeholder={placeholder}
            {...field}
            className={cn('pr-10', { 'pl-10': Boolean(leftSection) })}
            type={show ? 'text' : 'password'}
          />
        </InputWrapper>
      )}
    />
  );
}
