import React, { FormEvent } from 'react';

interface Props {
  onSubmit?(e: FormEvent<HTMLFormElement>): void;
  children?: React.ReactNode;
  Body?: React.ReactNode;
  Footer?: React.ReactNode;
}

const CardBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="bg-header px-4 py-5 shadow shadow-header sm:rounded-tl-md sm:rounded-tr-md">{children}</div>;
};

const CardFooter: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <footer className="sm: flex items-center justify-end gap-x-2 rounded-br-md bg-gray-dark px-4 py-3 text-right shadow shadow-gray-800 sm:rounded-bl-md sm:px-6">
      {children}
    </footer>
  );
};

const FormSectionCard = ({ children, onSubmit }: Props) => {
  return (
    <form className="mt-5 md:col-span-2 md:mt-0" onSubmit={onSubmit}>
      {children}
    </form>
  );
};

FormSectionCard.Footer = CardFooter;
FormSectionCard.Body = CardBody;

export default FormSectionCard;
