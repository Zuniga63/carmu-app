import type { NextPage } from 'next';
import LoginCard from '@/components/LoginPage/LoginCard';
import LoginForm from '@/components/LoginPage/LoginForm';

const Login: NextPage = () => {
  return (
    <LoginCard>
      <LoginForm />
    </LoginCard>
  );
};

export default Login;
