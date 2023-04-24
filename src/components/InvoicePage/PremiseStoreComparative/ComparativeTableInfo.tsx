import React from 'react';
import SaleStatistic from './SaleStatistic';
import ComparativeTableInvoices from './ComparativeTableInvoices';
import ComparativeTableInvoiced from './ComparativeTableInvoiced';

type Props = {
  statistic: SaleStatistic;
};

function ComparativeTableInfo({ statistic }: Props) {
  return (
    <td>
      <div className="flex justify-center px-2">
        <div className="flex flex-grow flex-col gap-y-2">
          {/* INVOICES */}
          <ComparativeTableInvoices statistic={statistic.invoiceStatistic} />

          {/* INVOICED */}
          <ComparativeTableInvoiced statistic={statistic.invoiced} />
        </div>
      </div>
    </td>
  );
}

export default ComparativeTableInfo;
