import React from 'react';
import { currencyFormat } from 'utils';

interface Props {
  title?: string;
  value?: number;
  small?: boolean;
  bold?: boolean;
}

const InvoiceFormSummaryItem: React.FC<Props> = ({
  title,
  value = 0,
  small = false,
  bold,
}) => {
  return (
    <div
      className={`group relative rounded border border-gray-200 border-transparent bg-light px-4 pt-2 hover:border hover:border-gray-300 hover:shadow dark:bg-slate-900`}
    >
      {title ? (
        <span
          className={`absolute top-0 left-2 -translate-y-1/2 px-1 ${
            small ? 'text-xs' : 'text-sm'
          } tracking-wider transition-colors group-hover:font-bold dark:bg-gradient-to-b dark:from-header dark:to-slate-900`}
        >
          {title}
        </span>
      ) : null}
      <p
        className={`text-right tracking-widest ${
          small ? 'text-xs' : 'text-base'
        } ${bold && 'font-bold'}`}
      >
        {currencyFormat(value)}
      </p>
    </div>
  );
};

export default InvoiceFormSummaryItem;
