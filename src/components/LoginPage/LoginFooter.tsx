import { Button } from '@mantine/core';
import { IconLogin } from '@tabler/icons';
import { authSelector } from 'src/features/Auth';
import { useAppSelector } from 'src/store/hooks';

type Props = {
  disabledButton?: boolean;
};

export default function LoginFooter({ disabledButton = false }: Props) {
  const { loading } = useAppSelector(authSelector);

  return (
    <footer className="mt-4 flex items-center justify-end">
      <Button
        type="submit"
        loading={loading}
        leftIcon={<IconLogin size={20} />}
        disabled={disabledButton}
      >
        {loading ? <span>Iniciando Sesión</span> : <span>Iniciar Sesión</span>}
      </Button>
    </footer>
  );
}
