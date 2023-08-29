import { FormEvent } from 'react';
import LoginHeader from './LoginHeader';
import LoginFooter from './LoginFooter';
import { PasswordInput, TextInput } from '@mantine/core';
import { IconEyeCheck, IconEyeOff, IconLock, IconMail } from '@tabler/icons-react';
import { useLogin } from '@/hooks/useLogin';

export default function LoginForm() {
  const { email, updateEmail, password, updatePassword, loginUser, isValid } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <form onSubmit={handleSubmit}>
      <LoginHeader />
      <section className="mb-2">
        <TextInput
          value={email}
          onChange={({ target }) => updateEmail(target.value)}
          placeholder="ejemplo@ejemplo.com"
          label="Email"
          required
          className="mb-2"
          type="email"
          icon={<IconMail size={20} />}
        />

        <PasswordInput
          value={password}
          onChange={({ target }) => updatePassword(target.value)}
          placeholder="Escribe la contraseña"
          label="Contraseña"
          required
          icon={<IconLock size={20} />}
          visibilityToggleIcon={({ reveal, size }) =>
            reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
          }
        />
      </section>
      <LoginFooter disabledButton={!isValid} />
    </form>
  );
}
