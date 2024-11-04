'use client';

import { IconLockAccess, IconLogin, IconMail, IconUser } from '@tabler/icons-react';

import { cn } from '@/utils';

import { useSignUpForm } from '../hooks';
import { Button } from '@/components/ui/Button';
import { AuthError } from './layouts/AuthError';
import { Form, FormPasswordInput, FormTextInput } from '@/components/ui/form';

interface Props {
  className?: string;
  callbackUrl?: string;
}

export default function SignUpForm({ className, callbackUrl }: Props) {
  const { form, handleSubmit, error, isLoading } = useSignUpForm({ callbackUrl });
  return (
    <div className={cn('grid gap-6', className)}>
      <Form {...form}>
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <FormTextInput
            control={form.control}
            name="username"
            label="Nombre de usuario"
            placeholder="Escribe tu nombre aquí"
            isRequired
            leftSection={<IconUser className="h-4 w-4" />}
            type="text"
          />

          <FormTextInput
            control={form.control}
            name="email"
            label="Correo Electronico"
            placeholder="ejemplo@binntu.com"
            isRequired
            type="email"
            leftSection={<IconMail className="h-4 w-4" />}
          />

          <FormPasswordInput
            control={form.control}
            name="password"
            label="Contraseña"
            placeholder="Escribe la contraseña"
            isRequired
            leftSection={<IconLockAccess size={20} stroke={2} />}
          />

          <FormPasswordInput
            control={form.control}
            name="passwordConfirmation"
            label="Confirmar contraseña"
            placeholder="Escribe la contraseña"
            isRequired
            leftSection={<IconLockAccess size={20} stroke={2} />}
          />

          {error && <AuthError message={error} />}

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Creando cuenta..."
            rightIcon={<IconLogin size={20} className="rotate-180 transform" />}
          >
            Registrarse
          </Button>
        </form>
      </Form>
    </div>
  );
}
