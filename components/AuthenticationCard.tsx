import React from 'react';

interface Props {
  children?: React.ReactNode;
}
export default function AuthenticationCard({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[url(/images/bg-login.jpg)] bg-cover bg-fixed bg-center bg-no-repeat pt-6 sm:justify-center sm:pt-0">
      {children}
    </div>
  );
}
