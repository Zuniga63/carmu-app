'use client';

// import { IconLockAccess, IconLogin, IconMail } from '@tabler/icons-react';

import { cn } from '@/utils';
import { useSignInForm } from '../hooks';

import { Button } from '@/components/ui/Button';
import { Form, FormPasswordInput, FormTextInput } from '@/components/ui/form';

import { AuthError } from './layouts/AuthError';
import { OAuthButtons } from './layouts/OAuthButtons';
import { IconLock, IconLogin, IconMail } from '@tabler/icons-react';

interface Props {
  className?: string;
  callbackUrl?: string;
}

export default function SignInForm({ className, callbackUrl }: Props) {
  const { form, handleSubmit, error, isLoading } = useSignInForm({ callbackUrl });

  return (
    <div className={cn('grid gap-6', className)}>
      <Form {...form}>
        <form className="grid gap-2" onSubmit={handleSubmit}>
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
            leftSection={<IconLock size={20} stroke={'2'} />}
          />

          {error && <AuthError message={error} />}

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Iniciando Sesión..."
            rightIcon={<IconLogin size={20} className="rotate-180 transform" />}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Form>

      <OAuthButtons callbackUrl={callbackUrl} />
    </div>
  );
}
