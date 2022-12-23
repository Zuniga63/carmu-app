import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { SigninData } from 'src/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

import AuthenticationCard from 'src/components/AuthenticationCard';
import {
  TextInput,
  PasswordInput,
  Alert,
  Notification,
  Button,
} from '@mantine/core';
import {
  IconLock,
  IconEyeOff,
  IconEyeCheck,
  IconAlertCircle,
  IconMail,
} from '@tabler/icons';
import brandLogo from 'public/images/logo_62601199d793d.png';
import Image from 'next/image';
import { authSelector, signin } from 'src/features/Auth';
import { getCookie } from 'cookies-next';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  //---------------------------------------------------------------------------
  // AUTH STATE
  //---------------------------------------------------------------------------
  const { loading, error, authIsSuccess, isAuth } =
    useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getCookie('access_token');
    if (isAuth && token) {
      router.push('/');
    }
  }, [isAuth]);

  useEffect(() => {
    if (error) setPassword('');
  }, [error]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: SigninData = { email, password };
    dispatch(signin(data));
  };

  return (
    <AuthenticationCard>
      <div className="mt-6 w-full overflow-hidden bg-light bg-opacity-60 px-6 py-4 shadow-lg shadow-gray-300 backdrop-blur-sm dark:bg-header dark:bg-opacity-60 dark:shadow-header sm:max-w-md sm:rounded-lg">
        <form onSubmit={onSubmit}>
          <header className="mb-4">
            <figure className="mx-auto block w-1/2">
              <Image src={brandLogo} alt="Carmú Logo" />
            </figure>
          </header>
          <div className="mb-2">
            <TextInput
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="ejemplo@ejemplo.com"
              label="Email"
              required
              className="mb-2"
              type="email"
              icon={<IconMail size={20} />}
              disabled={loading}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Escribe la contraseña"
              label="Contraseña"
              required
              icon={<IconLock size={20} />}
              visibilityToggleIcon={({ reveal, size }) =>
                reveal ? (
                  <IconEyeOff size={size} />
                ) : (
                  <IconEyeCheck size={size} />
                )
              }
              disabled={loading}
            />
          </div>

          {(error || loading || authIsSuccess) && (
            <div className="mb-2">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="¡Ops, algo salio mal!"
                  color="red"
                  className="mb-2"
                  variant="filled"
                >
                  <span className="text-red-100">{error}</span>
                </Alert>
              )}

              {loading && (
                <Notification loading disallowClose>
                  Verificando credenciales...
                </Notification>
              )}
            </div>
          )}

          <footer className="mt-4 flex items-center justify-end">
            <Button type="submit" variant="outline" disabled={loading}>
              Iniciar Sesión
            </Button>
          </footer>
        </form>
      </div>
    </AuthenticationCard>
  );
};

export default Login;
