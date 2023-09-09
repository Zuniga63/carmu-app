import { Metadata } from 'next';
import LoginContainer from './components/LoginContainer';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <LoginContainer>
      <LoginHeader />
      <LoginForm />
    </LoginContainer>
  );
}
