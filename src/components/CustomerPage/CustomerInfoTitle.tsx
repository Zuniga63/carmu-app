import React from 'react';
import { customerPageSelector } from 'src/features/CustomerPage';
import { useAppSelector } from 'src/store/hooks';
import { currencyFormat } from 'src/utils';

const CustomerInfoTitle = () => {
  const { customer } = useAppSelector(customerPageSelector);

  return (
    <div className="flex items-center gap-x-6">
      <div className="flex flex-col">
        <h1>
          Cliente <span className="font-bold tracking-widest">{customer?.fullName}</span>
        </h1>
        {customer?.documentNumber ? (
          <p className="text-xs">
            {customer?.documentType || 'CC'} : {customer?.documentNumber}{' '}
          </p>
        ) : null}
      </div>

      {customer?.balance ? <p className="font-bold tracking-widest">{currencyFormat(customer.balance)}</p> : null}
    </div>
  );
};

export default CustomerInfoTitle;
