import React from 'react';
import SaleStatistic from './SaleStatistic';
import ComparativeTableInvoices from './ComparativeTableInvoices';
import ComparativeTableInvoiced from './ComparativeTableInvoiced';
import ComparativeTableCash from './ComparativeTableCash';
import ComparativeTableCredit from './ComparativeTableCredit';
import ComparativeTableSeparate from './ComparativeTableSeparate';

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

          {/* CASH */}
          <ComparativeTableCash statistic={statistic.cash} />

          {/* CREDIT */}
          <ComparativeTableCredit statistic={statistic.credit} />

          {/* SEPARATED */}
          <ComparativeTableSeparate statistic={statistic.separate} />
        </div>
      </div>
    </td>
  );
}

export default ComparativeTableInfo;
