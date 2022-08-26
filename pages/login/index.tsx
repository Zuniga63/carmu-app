import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { LoginData } from 'types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { authUser } from 'store/reducers/Auth/creators';

import AuthenticationCard from 'components/AuthenticationCard';
import { TextInput, PasswordInput, Alert, Notification, Button } from '@mantine/core';
import { IconAt, IconLock, IconEyeOff, IconEyeCheck, IconAlertCircle, IconBuildingStore } from '@tabler/icons';
import { toast } from 'react-toastify';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  //---------------------------------------------------------------------------
  // AUTH STATE
  //---------------------------------------------------------------------------
  const { loading, error, loginIsSuccess, isAuth, user } = useAppSelector(state => state.AuthReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth) router.push('/');
  }, []);

  useEffect(() => {
    if (loginIsSuccess) {
      const message = (
        <span>
          ¡Bienvenido <strong className="font-bold">{user?.name}</strong>!
        </span>
      );
      toast.success(message, { position: 'top-right' });
      router.push('/');
    }
  }, [loginIsSuccess]);

  useEffect(() => {
    if (error) setPassword('');
  }, [error]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: LoginData = { email, password };
    dispatch(authUser(data));
    console.log(email, password);
  };

  return (
    <AuthenticationCard>
      <div className="rounded-full bg-white p-4 text-gray-600">
        <IconBuildingStore size={64} />
      </div>
      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
        <form onSubmit={onSubmit}>
          <div className="mb-2">
            <TextInput
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Escribelo aquí"
              label={<span className="text-gray-800">Email</span>}
              required
              className="mb-2"
              type="email"
              icon={<IconAt size={20} />}
              disabled={loading || isAuth}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Escribe la contraseña"
              label={<span className="text-gray-800">Contraseña</span>}
              required
              icon={<IconLock size={20} />}
              visibilityToggleIcon={({ reveal, size }) =>
                reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
              }
              disabled={loading || isAuth}
            />
          </div>

          {(error || loading || loginIsSuccess) && (
            <div className="mb-2">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="¡Ops, algo salio mal!"
                  color="red"
                  className="mb-2"
                  withCloseButton
                >
                  <span className="text-red-400">{error}</span>
                </Alert>
              )}

              {loading && (
                <Notification loading disallowClose>
                  Verificando credenciales...
                </Notification>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" variant="outline" disabled={loading || loginIsSuccess}>
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </AuthenticationCard>
  );
};

export default Login;
