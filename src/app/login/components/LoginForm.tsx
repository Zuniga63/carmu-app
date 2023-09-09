'use client';
import { FormEvent } from 'react';
import EmailInput from '@/components/forms/EmailInput';
import PasswordInput from '@/components/forms/PasswordInput';
import { Button } from '@chakra-ui/react';
import { IconLogin } from '@tabler/icons-react';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const { email, password, updateEmail, updatePassword, loading: isLoading, loginUser: login } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 flex flex-col gap-y-4 xl:mb-14 xl:gap-y-6">
        <EmailInput value={email} onChange={updateEmail} label="Correo Electronico" isRequired />
        <PasswordInput
          value={password}
          onChange={updatePassword}
          label="Contraseña"
          isRequired
          placeholder="Contraseña"
        />
      </div>

      <footer className="mx-auto flex w-full items-center justify-end xl:w-10/12">
        <Button
          className="flex-grow"
          colorScheme="blue"
          type="submit"
          isLoading={isLoading}
          loadingText="Iniciando Sesión..."
          rightIcon={<IconLogin size={20} className="rotate-180 transform" />}
        >
          Iniciar Sesión
        </Button>
      </footer>
    </form>
  );
}
