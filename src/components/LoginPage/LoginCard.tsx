import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export default function LoginCard({ children }: Props) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[url(/images/bg-login.jpg)] bg-cover bg-fixed bg-center bg-no-repeat pt-6 sm:justify-center sm:pt-0">
      <div className="mt-6 w-full overflow-hidden bg-light bg-opacity-60 px-6 py-4 shadow-lg shadow-gray-300 backdrop-blur-sm dark:bg-header dark:bg-opacity-60 dark:shadow-header sm:max-w-md sm:rounded-lg">
        {children}
      </div>
    </main>
  );
}
