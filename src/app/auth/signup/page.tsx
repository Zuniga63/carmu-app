import { Metadata } from 'next';
import Link from 'next/link';

import { cn } from '@/utils';

// import SignUpForm from '@/modules/core/components/SignUpForm';

import { buttonVariants } from '@/components/ui/Button';
import { AuthContainer, AuthError, AuthHeader, AuthLayout } from '@/modules/auth/components/layouts';
import SignUpForm from '@/modules/auth/components/SignUpForm';

export const metadata: Metadata = {
  title: 'Autenticación',
  description: 'Regístrate y descubre: Empieza tu viaje hacia experiencias inolvidables.',
};

interface Props {
  searchParams?: {
    error?: string;
    callbackUrl?: string;
  };
}

export default function SignUpPage({ searchParams }: Props) {
  const callbackUrl = searchParams?.callbackUrl ? `?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}` : '';

  return (
    <AuthLayout>
      <Link
        href={`/auth/signin${callbackUrl}`}
        className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
      >
        Iniciar Sesión
      </Link>
      <AuthContainer>
        <AuthHeader
          title="Crear una cuenta"
          description="Introduzca su correo electrónico y contraseña para registrar una cuenta."
        />

        <SignUpForm callbackUrl={searchParams?.callbackUrl} />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Al hacer clic en Continuar, acepta nuestras{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Condiciones de Uso
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Políticas de privacidad
          </Link>
          .
        </p>

        <AuthError message={searchParams?.error} />
      </AuthContainer>
    </AuthLayout>
  );
}
