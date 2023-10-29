import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getCustomerBySearch,
  getCustomerWithBalance,
  sortCustomersByBalance,
  sortCustomersByLastPayment,
} from '@/logic/customer';
import { ICustomer, CustomerFilters } from '@/types';
import { useGetAllCustomers } from './react-query/customers.hooks';

const CUSTOMER_BY_PAGE = 25;
const INITIAL_FILTER: CustomerFilters = {
  search: '',
  onlyCustomerWithDebt: true,
  sortByBalance: false,
  reverse: false,
  sortByRecentPayment: false,
};

export function useCustomerFilter() {
  const { data: customers = [] } = useGetAllCustomers();

  const [filters, setFilters] = useState<CustomerFilters>(INITIAL_FILTER);
  const [waiting, setWaiting] = useState(false);
  const prevSearch = useRef<string | null>(null);
  const [filteredCustomers, setFilterCustomers] = useState<ICustomer[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const customerByPage = useMemo(() => {
    const startIndex = CUSTOMER_BY_PAGE * activePage - CUSTOMER_BY_PAGE;
    const endIndex = activePage * CUSTOMER_BY_PAGE;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, activePage]);

  const filterCustomers = useCallback(
    ({
      search,
      onlyCustomerWithDebt = false,
      sortByBalance = false,
      sortByRecentPayment = false,
      reverse = false,
    }: CustomerFilters) => {
      let result = [...customers];
      if (search) {
        result = getCustomerBySearch(customers, search);
      }

      if (onlyCustomerWithDebt) {
        result = getCustomerWithBalance(result);
      }

      if (sortByBalance) {
        result = sortCustomersByBalance(result, reverse);
      }

      if (sortByRecentPayment) {
        result = sortCustomersByLastPayment(result, reverse);
      }

      setFilterCustomers(result);
    },
    [customers],
  );

  const updateActivePage = (value: number) => {
    let newActivePage = value;
    if (value <= 0) newActivePage = 1;
    else if (value > totalPages) newActivePage = totalPages;

    setActivePage(newActivePage);
  };

  useEffect(() => {
    filterCustomers(filters);
  }, [customers]);

  useEffect(() => {
    if (prevSearch.current !== filters.search) {
      prevSearch.current = filters.search;
      setWaiting(true);
    }

    const timer = setTimeout(() => {
      filterCustomers(filters);
      setWaiting(false);
    }, 350);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [filters]);

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredCustomers.length / CUSTOMER_BY_PAGE);

    setActivePage(1);
    setTotalPages(newTotalPages);
  }, [filteredCustomers]);

  return {
    filters,
    setFilters,
    activePage,
    totalPages,
    updateActivePage,
    waiting,
    customers: customerByPage,
  };
}
