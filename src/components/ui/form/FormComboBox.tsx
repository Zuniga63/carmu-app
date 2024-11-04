'use client';

import { cn } from '@/utils';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { Button } from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IconCheck, IconChevronsDown } from '@tabler/icons-react';

type ComboBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  isRequired?: boolean;
  options?: {
    label: string;
    value: string | number;
  }[];
  onSelect?: (value: string | number) => void;
};

export function FormComboBox<
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
}: ComboBoxProps<TFieldValues, TName>) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? options.find(opt => opt.value === field.value)?.label : 'Selecciona un tenant'}
                    <IconChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder={placeholder} className="h-9" />
                <CommandEmpty>No se encontró.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {options.map(opt => (
                      <CommandItem
                        value={opt.label}
                        key={opt.value}
                        onSelect={() => {
                          if (!onSelect) return;
                          onSelect(opt.value);
                        }}
                      >
                        {opt.label}
                        <IconCheck
                          className={cn('ml-auto h-4 w-4', opt.value === field.value ? 'opacity-100' : 'opacity-0')}
                        />
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
