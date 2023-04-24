import React, { useState } from 'react';
import { configSelector } from 'src/features/Config';
import { invoicePageSelector } from 'src/features/InvoicePage';
import { useAppSelector } from 'src/store/hooks';
import DailyStatistic from './DailyStatistic';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Button, Table } from '@mantine/core';
import ComparativeTableDate from './ComparativeTableDate';
import ComparativeTableInfo from './ComparativeTableInfo';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function ComparativeTable() {
  const { premiseStores } = useAppSelector(configSelector);
  const { invoices: allInvoices } = useAppSelector(invoicePageSelector);
  const [dailyStatistics, setDailyStatistics] = useState<DailyStatistic[]>([]);
  const [loading, setLoading] = useState(false);

  function getMonthInvoices() {
    const startOfMonth = dayjs().startOf('month');
    return allInvoices.filter(
      invoice =>
        !Boolean(invoice.cancel) &&
        startOfMonth.isSameOrBefore(invoice.expeditionDate) &&
        Boolean(invoice.premiseStore)
    );
  }

  function generateReport() {
    setLoading(true);
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    let date = startOfMonth.clone();
    let count = 0;
    const result: DailyStatistic[] = [];
    const invoices = getMonthInvoices();

    while (date.isSameOrBefore(today)) {
      const daily = new DailyStatistic(date, premiseStores);
      const startDay = date.startOf('day');
      const endDay = date.endOf('day');
      const dailyInvoice = invoices.filter(
        inv =>
          startDay.isSameOrBefore(inv.expeditionDate) &&
          endDay.isSameOrAfter(inv.expeditionDate)
      );

      daily.addInvoices(dailyInvoice, result.at(-1));
      result.push(daily);

      date = date.add(1, 'day');
      count += 1;

      if (count > 31) {
        break;
      }
    }

    setDailyStatistics(result.reverse());
    setLoading(false);
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex justify-center">
        <Button onClick={generateReport} loading={loading}>
          Generar Informe
        </Button>
      </div>
      <Table striped verticalSpacing="md">
        <thead>
          <th>Día</th>
          {premiseStores.map(store => (
            <th key={store.id}>{store.name}</th>
          ))}
          <th>Total</th>
        </thead>
        <tbody>
          {dailyStatistics.map(daily => (
            <tr key={daily.id}>
              {/* DATE */}
              <ComparativeTableDate date={daily.date} />
              {/* STORES */}
              {daily.stores.map(dailyStore => (
                <ComparativeTableInfo
                  key={dailyStore.store.id}
                  statistic={dailyStore}
                />
              ))}
              <ComparativeTableInfo statistic={daily} />
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ComparativeTable;
