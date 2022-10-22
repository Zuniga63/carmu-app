import React from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

function InvoiceFormGroup({ title, children, className }: Props) {
  return (
    <div className={`relative rounded-md border border-slate-800 p-4 pt-6 ${className}`}>
      <span className="absolute top-0 left-6 -translate-y-1/2 rounded-full border border-dark bg-header py-1 px-4 text-xs font-bold tracking-wider">
        {title}
      </span>
      {children}
    </div>
  );
}

export default InvoiceFormGroup;
