import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
  message?: string;
}
export function AuthError({ message }: Props = {}) {
  if (!message) return null;

  return (
    <Alert variant="destructive">
      <IconAlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
