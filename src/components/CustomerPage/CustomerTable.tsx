import { useCustomerFilter } from 'src/hooks/useCustomerFilter';
import CustomerTableHeader from './CustomerTableHeader';
import CustomerTableFooter from './CustomerTableFooter';
import CustomerTableBody from './CustomerTableBody';

const CustomerTable = () => {
  const { filters, setFilters, activePage, totalPages, updateActivePage, waiting, customers } = useCustomerFilter();

  return (
    <div className="mx-auto w-11/12 pt-4 text-dark dark:text-light">
      <CustomerTableHeader filters={filters} updateFilters={setFilters} searchWaiting={waiting} />

      <CustomerTableBody customers={customers} />

      <CustomerTableFooter page={activePage} totalPages={totalPages} onUpdatePage={updateActivePage} />
    </div>
  );
};

export default CustomerTable;
