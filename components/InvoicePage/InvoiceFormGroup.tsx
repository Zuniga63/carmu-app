import React from 'react';

interface Props {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

function InvoiceFormGroup({ title, children, className }: Props) {
  return (
    <div
      className={`relative rounded-md border border-gray-300 bg-gray-200 p-4 pt-6 shadow-lg  dark:border-slate-800 dark:bg-header ${className}`}
    >
      {title ? (
        <span className="absolute top-0 left-6 -translate-y-1/2 rounded-full border border-gray-300 bg-gray-200 py-1 px-4 text-xs font-bold tracking-wider text-gray-dark shadow dark:border-slate-700 dark:bg-header dark:text-light">
          {title}
        </span>
      ) : null}
      {children}
    </div>
  );
}

export default InvoiceFormGroup;
