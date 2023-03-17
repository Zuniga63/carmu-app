import React from 'react';

interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onSubmit?(): void;
}

const FormSection = ({ title, description, children, onSubmit }: Props) => {
  return (
    <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        {/* INFO */}
        <div className="flex justify-between md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
