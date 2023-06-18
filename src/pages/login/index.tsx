import type { NextPage } from 'next';
import LoginCard from 'src/components/LoginPage/LoginCard';
import LoginForm from 'src/components/LoginPage/LoginForm';

const Login: NextPage = () => {
  return (
    <LoginCard>
      <LoginForm />
    </LoginCard>
  );
};

export default Login;
