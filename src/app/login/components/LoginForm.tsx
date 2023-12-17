'use client';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { IconLogin } from '@tabler/icons-react';
import { useLogin } from '../hooks/useLogin';
import { Input } from '@/components/ui/Input';

export default function LoginForm() {
  const { email, password, updateEmail, updatePassword, loading: isLoading, loginUser: login } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 flex flex-col gap-y-4 xl:mb-14 xl:gap-y-6">
        <Input
          type="email"
          value={email}
          onChange={({ currentTarget }) => updateEmail(currentTarget.value)}
          required
          className="bg-background"
          placeholder="ejemplo@ejemplo.com"
        />

        <Input
          type="password"
          value={password}
          onChange={({ currentTarget }) => updatePassword(currentTarget.value)}
          required
          className="bg-background"
          placeholder="contraseña"
        />
      </div>

      <footer className="mx-auto flex w-full items-center justify-end xl:w-10/12">
        <Button className="flex-grow" type="submit">
          <IconLogin size={20} className="mr-4 rotate-180 transform" />
          Iniciar Sesión
        </Button>
      </footer>
    </form>
  );
}
