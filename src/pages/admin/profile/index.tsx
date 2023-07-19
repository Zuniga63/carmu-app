import { Button, PasswordInput } from '@mantine/core';
import { IconEyeCheck, IconEyeOff, IconLock } from '@tabler/icons-react';
import axios, { AxiosError } from 'axios';
import Layout from 'src/components/Layout';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'src/store/hooks';
import { logout } from 'src/features/Auth';
import { IValidationErrors } from 'src/types';
import FormSection from 'src/components/FormSection';
import FormSectionCard from 'src/components/FormSectionCard';

const ProfilePage: NextPage = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      setErrors(null);
      await axios.put('/auth/local/update-password', {
        password,
        newPassword,
        confirmPassword,
      });
      toast.success('Contraseña actualizada');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        const data = response?.data;

        if (response?.status === 404 || response?.status === 401) {
          toast.error('No se ha podido cambiar la contraseña');
          dispatch(logout());
          setTimeout(() => {
            router.push('/login');
          }, 1000);
        } else if (response?.status === 400) {
          toast.error(data.message);
          setPassword('');
        } else if (response?.status === 422 && data.validationErrors) {
          setErrors(data.validationErrors);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Perfil de Usuario">
      <FormSection
        title="Actualizar Contraseña"
        description="Aseguresé de que su cuenta esté usando una contraseña larga y aleatoria para mantenerse seguro."
      >
        <FormSectionCard onSubmit={onSubmit}>
          <FormSectionCard.Body>
            <div className="grid grid-cols-6">
              <PasswordInput
                icon={<IconLock size={16} />}
                label="Contraseña actual"
                required
                className="col-span-6 md:col-span-4"
                visibilityToggleIcon={({ reveal, size }) =>
                  reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
                }
                value={password}
                onChange={({ currentTarget }) => setPassword(currentTarget.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <PasswordInput
                icon={<IconLock size={16} />}
                label="Nueva contraseña"
                required
                className="col-span-6 md:col-span-4"
                visibilityToggleIcon={({ reveal, size }) =>
                  reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
                }
                value={newPassword}
                onChange={({ currentTarget }) => setNewPassword(currentTarget.value)}
                disabled={loading}
                error={errors?.password?.message}
                autoComplete="new-password"
              />
              <PasswordInput
                icon={<IconLock size={16} />}
                label="Confirmar contraseña"
                required
                className="col-span-6 md:col-span-4"
                visibilityToggleIcon={({ reveal, size }) =>
                  reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
                }
                value={confirmPassword}
                onChange={({ currentTarget }) => setConfirmPassword(currentTarget.value)}
                disabled={loading}
                error={errors?.confirmPassword?.message}
                autoComplete="new-password"
              />
            </div>
          </FormSectionCard.Body>
          <FormSectionCard.Footer>
            <Button type="submit" loading={loading}>
              Guardar
            </Button>
          </FormSectionCard.Footer>
        </FormSectionCard>
      </FormSection>
    </Layout>
  );
};

export default ProfilePage;
