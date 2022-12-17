import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { LoginData } from 'types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { authUser } from 'store/reducers/Auth/creators';

import AuthenticationCard from 'components/AuthenticationCard';
import {
  TextInput,
  PasswordInput,
  Alert,
  Notification,
  Button,
} from '@mantine/core';
import {
  IconAt,
  IconLock,
  IconEyeOff,
  IconEyeCheck,
  IconAlertCircle,
} from '@tabler/icons';
import brandLogo from 'public/images/logo_62601199d793d.png';
import Image from 'next/image';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  //---------------------------------------------------------------------------
  // AUTH STATE
  //---------------------------------------------------------------------------
  const { loading, error, loginIsSuccess, isAuth } = useAppSelector(
    state => state.AuthReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth) router.push('/');
  }, [isAuth]);

  useEffect(() => {
    if (error) setPassword('');
  }, [error]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: LoginData = { email, password };
    dispatch(authUser(data));
  };

  return (
    <AuthenticationCard>
      <div className="mt-6 w-full overflow-hidden bg-header bg-opacity-60 px-6 py-4 shadow-lg shadow-header backdrop-blur-sm sm:max-w-md sm:rounded-lg">
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
              placeholder="Escribelo aquí"
              label="Email"
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
            <Button
              type="submit"
              variant="outline"
              disabled={loading || loginIsSuccess}
            >
              Iniciar Sesión
            </Button>
          </footer>
        </form>
      </div>
    </AuthenticationCard>
  );
};

export default Login;
