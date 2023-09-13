import { authenticateUser, validateToken } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useAuthenticateUser() {
  const toast = useToast({ position: 'top-left' });
  const saveCredentials = useAuthStore(state => state.saveCredentials);

  return useMutation({
    mutationFn: authenticateUser,
    onSuccess: ({ user, token }) => {
      toast({
        title: `¡Bienvenido ${user?.name}!`,
        status: 'success',
      });

      if (user && token) saveCredentials({ user, token });
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

export function useAuthenticateToken() {
  const updateUser = useAuthStore(state => state.updateUser);

  return useMutation({
    mutationFn: validateToken,
    onSuccess({ user }) {
      if (user) updateUser(user);
    },
  });
}
