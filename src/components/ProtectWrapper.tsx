import { useId, KeyboardEvent } from 'react';
import { IconLockAccess } from '@tabler/icons-react';

import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useConfigStore } from '@/store/config-store';

type Props = {
  inputName?: string;
  children?: React.ReactNode;
};
export default function ProtectWrapper({ children, inputName = 'content-password' }: Props) {
  const showInformation = useConfigStore(state => state.showSensitiveInformation);
  const blockInformation = useConfigStore(state => state.blockSesitiveInformation);
  const unlockInformation = useConfigStore(state => state.unlockSensitiveInformation);

  const passwordInputId = useId();

  const handleClick = () => {
    const input = document.getElementById(passwordInputId) as HTMLInputElement | null;
    if (!input) return;

    unlockInformation(input.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleClick();
  };

  return showInformation ? (
    <div className="relative">
      <div className="absolute right-4 top-4 z-fixed">
        <Button variant={'outline'} size={'icon'} onClick={blockInformation}>
          <IconLockAccess />
        </Button>
      </div>
      {children}
    </div>
  ) : (
    <div className="flex h-96 flex-col items-center justify-center gap-y-8">
      <h2 className="text-lg font-bold">Contenido Bloqueado</h2>
      <Input
        id={passwordInputId}
        name={inputName}
        placeholder="Escribe la contraseña"
        className="w-60"
        onKeyDown={handleKeyDown}
        type="password"
        role="security"
      />
      <Button onClick={handleClick}>
        Desbloquear
      </Button>
    </div>
  );
}
