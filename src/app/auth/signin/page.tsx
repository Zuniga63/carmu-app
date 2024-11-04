import { Metadata } from 'next';
import { AuthContainer, AuthError, AuthHeader, AuthLayout } from '@/modules/auth/components/layouts';
import Link from 'next/link';
import { cn } from '@/utils';
import { buttonVariants } from '@/components/ui/Button';
import SignInForm from '@/modules/auth/components/SignInForm';

export const metadata: Metadata = {
  title: 'Autenticación',
  description: 'Autentícate para acceder a tu cuenta.',
};

interface Props {
  searchParams?: {
    error?: string;
    callbackUrl?: string;
  };
}

export default function LoginPage({ searchParams }: Props) {
  const callbackUrl = searchParams?.callbackUrl ? `?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}` : '';
  return (
    <AuthLayout>
      <Link
        href={`/auth/signup${callbackUrl}`}
        className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
      >
        Registrarse
      </Link>

      <AuthContainer>
        <AuthHeader
          title="Iniciar Sesión"
          description="Introduzca su correo electrónico y contraseña para acceder a su cuenta."
        />
        <SignInForm callbackUrl={searchParams?.callbackUrl} />
        <AuthError message={searchParams?.error} />
      </AuthContainer>
    </AuthLayout>
  
  );
}
