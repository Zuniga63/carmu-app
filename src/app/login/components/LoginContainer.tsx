import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export default function LoginContainer({ children }: Props) {
  return (
    <main className="bg-login bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="h-screen w-full">
        <div className="flex h-full items-center justify-center xl:items-stretch xl:justify-end">
          <div className="w-full bg-light bg-opacity-70 px-6 py-4 shadow backdrop-blur xs:max-w-sm xs:rounded-lg xl:w-1/3 xl:max-w-none xl:rounded-none xl:bg-opacity-90 xl:px-8 xl:pt-10 2xl:w-3/12">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
