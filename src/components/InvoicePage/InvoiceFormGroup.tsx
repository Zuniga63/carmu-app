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
        <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full border border-gray-300 bg-gray-200 px-4 py-1 text-xs font-bold tracking-wider text-gray-dark shadow dark:border-slate-700 dark:bg-header dark:text-light">
          {title}
        </span>
      ) : null}
      {children}
    </div>
  );
}

export default InvoiceFormGroup;
