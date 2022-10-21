import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}
const InvoiceCardField = ({ title, children }: Props) => {
  return (
    <div className="relative rounded-lg border border-gray-600 bg-gray-300 px-3 pt-3 pb-1 text-sm text-dark shadow shadow-dark">
      <div className="absolute top-0 left-4 -translate-y-1/2 rounded-full bg-header px-4 py-[2px] text-xs font-bold tracking-widest text-light shadow-lg">
        {title}
      </div>
      {children}
    </div>
  );
};

export default InvoiceCardField;
