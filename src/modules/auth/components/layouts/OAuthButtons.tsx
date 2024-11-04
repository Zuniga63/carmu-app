'use client';

import { IconBrandGoogle } from '@tabler/icons-react';

import { useSignIn } from '../../services';
import { AuthProvidersEnum } from '../../config';

import { Button } from '@/components/ui/Button';

interface Props {
  callbackUrl?: string;
}

export function OAuthButtons({ callbackUrl }: Props) {
  const { isPending, mutate: signIn } = useSignIn({ callbackUrl });

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O continuar con</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        isLoading={isPending}
        loadingText="Iniciando Sesion"
        onClick={() => signIn({ provider: AuthProvidersEnum.GOOGLE })}
      >
        <IconBrandGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </>
  );
}
