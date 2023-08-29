import { Button, PasswordInput } from '@mantine/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { configSelector, unlockContent } from '@/features/Config';
import { useAppSelector } from '@/store/hooks';

type Props = {
  children: React.ReactNode;
};
export default function ProtectWrapper({ children }: Props) {
  const { blockSensitiveInformation: blocked } = useAppSelector(configSelector);
  const [password, setPassword] = useState('');
  const dispath = useDispatch();

  const handleClick = () => {
    dispath(unlockContent(password));
    setPassword('');
  };

  if (blocked)
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-y-8">
        <h2 className="text-lg font-bold">Contenido Bloqueado</h2>
        <PasswordInput
          id="content-password"
          name="content-password"
          value={password}
          onChange={({ currentTarget }) => setPassword(currentTarget.value)}
          placeholder="Escribe la contraseña"
          className="w-60"
        />
        <Button onClick={handleClick}>Desbloquear</Button>
      </div>
    );

  return <>{children}</>;
}
