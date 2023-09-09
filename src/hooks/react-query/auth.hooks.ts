import { saveAuthData } from '@/logic/auth-logic';
import { authenticateUser } from '@/services/auth-service';
import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useAuthenticateUser() {
  const toast = useToast({ position: 'top-left' });

  return useMutation({
    mutationFn: authenticateUser,
    onSuccess: ({ user, token }) => {
      toast({
        title: `¡Bienvenido ${user?.name}!`,
        status: 'success',
      });

      if (user && token) {
        saveAuthData(token);
      }
    },
    onError: error => {
      let errorMessage: string | undefined;
      if (error instanceof Error) {
        if (axios.isAxiosError(error)) {
          const { response } = error;
          if (response?.status === 400) errorMessage = 'Usuario o contraseña incorrectos.';
        }

        errorMessage ||= error?.message;
      }

      toast({
        title: '¡Opps, algo salio mal!',
        description: errorMessage,
        status: 'error',
      });
    },
  });
}
