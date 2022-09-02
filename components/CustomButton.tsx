import React from 'react';

interface Props {
  disabled?: boolean;
  onClick?(): void;
  children?: React.ReactNode;
  className?: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
}
export default function CustomButton({ disabled, onClick, children, className, type = 'button' }: Props) {
  return (
    <button
      className={`transition-color rounded-md border border-gray-800 bg-btn-bg px-4 py-2 text-light duration-200 hover:text-opacity-50 active:text-opacity-100 disabled:opacity-50 ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
