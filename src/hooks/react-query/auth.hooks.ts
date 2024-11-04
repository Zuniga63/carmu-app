import { validateToken } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { useMutation } from '@tanstack/react-query';

export function useAuthenticateToken() {
  const updateUser = useAuthStore(state => state.updateUser);

  return useMutation({
    mutationFn: validateToken,
    onSuccess({ user }) {
      if (user) updateUser(user);
    },
  });
}
