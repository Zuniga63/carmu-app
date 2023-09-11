import { ActionIcon, Button, PasswordInput } from '@mantine/core';
import { useId, KeyboardEvent } from 'react';
import { useConfigStore } from '@/store/config-store';
import { IconLockAccess } from '@tabler/icons-react';

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
        <ActionIcon onClick={blockInformation}>
          <IconLockAccess />
        </ActionIcon>
      </div>
      {children}
    </div>
  ) : (
    <div className="flex h-96 flex-col items-center justify-center gap-y-8">
      <h2 className="text-lg font-bold">Contenido Bloqueado</h2>
      <PasswordInput
        id={passwordInputId}
        name={inputName}
        placeholder="Escribe la contraseña"
        className="w-60"
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleClick}>Desbloquear</Button>
    </div>
  );
}
