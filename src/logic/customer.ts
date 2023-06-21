import dayjs from 'dayjs';
import { ICustomer } from 'src/types';
import { normalizeText } from 'src/utils';

export const getCustomerWithBalance = (customers: ICustomer[]) => {
  return customers.filter(c => c.balance && c.balance > 0);
};

export const getCustomerBySearch = (customers: ICustomer[], search: string) => {
  const searchValue = normalizeText(search);
  return customers.filter(({ fullName, documentNumber, alias }) => {
    const text = `${fullName} ${documentNumber || ''} ${alias || ''}`.trim();
    return normalizeText(text).includes(searchValue);
  });
};

export const sortCustomersByBalance = (
  customers: ICustomer[],
  reverse = false
) => {
  return [...customers].sort((currentCustomer, lastCustomer) => {
    let result = 0;

    if (!currentCustomer.balance) result = -1;
    else if (!lastCustomer.balance) result = 1;
    else if (currentCustomer.balance < lastCustomer.balance) result = -1;
    else if (currentCustomer.balance > lastCustomer.balance) result = 1;

    if (reverse) result *= -1;

    return result;
  });
};

export const sortCustomersByLastPayment = (
  customers: ICustomer[],
  reverse = false
) => {
  return [...customers].sort((currentCustomer, lastCustomer) => {
    let result = 0;

    const currentCustomerDiff = dayjs().diff(
      currentCustomer.lastPayment || currentCustomer.firstPendingInvoice
    );

    const lastCustomerDiff = dayjs().diff(
      lastCustomer.lastPayment || lastCustomer.firstPendingInvoice
    );

    if (currentCustomerDiff < lastCustomerDiff) result = -1;
    else if (currentCustomerDiff > lastCustomerDiff) result = 1;

    if (reverse) result *= -1;

    return result;
  });
};
