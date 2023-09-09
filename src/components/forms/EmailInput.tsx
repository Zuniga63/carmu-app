'use client';

import { FormControl, FormLabel, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { IconMail } from '@tabler/icons-react';
import { ChangeEvent } from 'react';

type Props = {
  value?: string;
  isRequired?: boolean;
  label?: string;
  placeholder?: string;
  onChange?(value: string): void;
};

export default function EmailInput({ value, isRequired, label, onChange, placeholder = 'example@example.com' }: Props) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <FormControl isRequired={isRequired}>
      {label && <FormLabel className="text-dark">{label}</FormLabel>}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <IconMail size={20} stroke={2} className="text-dark" />
        </InputLeftElement>
        <Input
          type="email"
          placeholder={placeholder}
          backgroundColor="white"
          className="tracking-wider text-dark"
          value={value}
          onChange={handleChange}
          size="md"
          rounded="md"
          onFocus={e => e.currentTarget.select()}
        />
      </InputGroup>
    </FormControl>
  );
}
