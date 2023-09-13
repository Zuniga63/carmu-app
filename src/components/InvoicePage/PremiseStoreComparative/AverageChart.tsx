import { Button, Select, Table } from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { invoicePageSelector } from '@/features/InvoicePage';
import { useAppSelector } from '@/store/hooks';
import { CHART_COLORS, currencyFormat } from '@/utils';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import MonthlyReport from './MonthlyReport';
import DailyReport, { ReportInvoice } from './DailyReport';
import { IconChartArcs3 } from '@tabler/icons-react';
import ProtectWrapper from '@/components/ProtectWrapper';
import { useGetAllPremiseStore } from '@/hooks/react-query/premise-store.hooks';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const lineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        callback: function (value, index, ticks) {
          return currencyFormat(value);
        },
      },
      beginAtZero: false,
    },
    x: { beginAtZero: true },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const { dataset } = context;
          let label = dataset.label || '';

          if (label) label += ': ';
          if (context.parsed.y !== null) label += currencyFormat(context.parsed.y);

          return label;
        },
        afterLabel(tooltipItem) {
          let afterLabel = '';
          const { dataset, dataIndex, parsed } = tooltipItem;

          if (dataIndex > 0) {
            const lastData = dataset.data[dataIndex - 1];
            const diff = Number(parsed.y) - Number(lastData);
            const percentage = Math.round((diff / Number(lastData)) * 100);

            if (!isNaN(percentage) && percentage > 0 && isFinite(percentage)) {
              afterLabel += `+${percentage}% (${currencyFormat(diff)})`;
            }
          }
          return afterLabel;
        },
      },
    },
  },
};

export default function AverageChart() {
  const { invoices: allInvoices } = useAppSelector(invoicePageSelector);
  const { data: premiseStores } = useGetAllPremiseStore();

  const [storeSelected, setStoreSelected] = useState<string | null>('all');
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [dailyChartData, setDailyChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });

  function getAnnualReportInvoices(date: Dayjs): ReportInvoice[] {
    return allInvoices
      .filter(({ expeditionDate, cancel, premiseStore }) => {
        let result = false;
        if (!cancel && date.isSameOrBefore(expeditionDate)) {
          result = true;
        }

        if (result && storeSelected && storeSelected !== 'all') {
          result = premiseStore?.id === storeSelected;
        }

        return result;
      })
      .map(({ id, expeditionDate, amount }) => ({
        id,
        date: expeditionDate,
        amount,
      }));
  }

  function createMonthlyReports(): MonthlyReport[] {
    const reports: MonthlyReport[] = [];
    const today = dayjs();
    let date = today.startOf('year');
    let lastReport: MonthlyReport | undefined;
    const invoices = getAnnualReportInvoices(date);

    while (date.isBefore(today)) {
      const startMonth = date.clone();
      const endMonth = date.endOf('month');
      const monthlyInvoices = invoices.filter(
        ({ date }) => startMonth.isSameOrBefore(date) && endMonth.isSameOrAfter(date),
      );

      const monthlyReport = new MonthlyReport(date, monthlyInvoices, lastReport, date.month() === today.month());

      reports.push(monthlyReport);
      lastReport = monthlyReport;

      date = date.add(1, 'month');
    }

    return reports;
  }

  function getChartLabels() {
    const today = dayjs();
    const labels: string[] = [];
    let date = today.startOf('month').subtract(1, 'day');

    while (date.isBefore(today) || date.date() < 7) {
      labels.push(date.format('ddd DD'));
      date = date.add(1, 'day');
    }

    return labels;
  }

  function averageDataset(
    label: string,
    value: number | null,
    points: number,
    point: 'max' | 'middle' | 'min' = 'middle',
  ): ChartDataset<'line'> {
    const data: (number | null)[] = [];
    const color = point === 'middle' ? CHART_COLORS.grey : point === 'max' ? CHART_COLORS.green : CHART_COLORS.red;

    for (let index = 0; index < points; index++) {
      data.push(value);
    }

    return {
      label,
      data,
      backgroundColor: color,
      borderColor: color,
      fill: false,
      tension: 0.2,
      pointBorderWidth: 1,
      borderDash: [5],
      pointStyle: 'dash',
    };
  }

  function getDailyDataset(
    dailyReports: DailyReport[],
    lastMonthlyReport?: MonthlyReport,
    isDaily = true,
  ): ChartDataset<'line'> {
    const data: (number | null)[] = [
      lastMonthlyReport?.dailyAverage || null,
      ...dailyReports.map(({ amount, monthlyDailyAverage }) => (isDaily ? amount : monthlyDailyAverage)),
    ];

    return {
      label: isDaily ? 'Diario' : 'Promedio',
      data,
      backgroundColor: CHART_COLORS.blue,
      borderColor: CHART_COLORS.blue,
      fill: false,
      tension: 0.2,
      pointBorderWidth: 1,
      borderDash: isDaily ? undefined : [5, 5],
    };
  }

  function getAverages(reports: MonthlyReport[]) {
    let days = 0;
    let annualAmount = 0;
    const monthAmounts: number[] = [];

    reports.forEach(({ dailyReports, amount: monthAmount }) => {
      if (monthAmount > 0) {
        let monthCount = 0;

        dailyReports.forEach(({ amount }) => {
          if (amount > 0) {
            monthCount += 1;
            annualAmount += amount;
            days += 1;
          }
        });

        if (monthCount > 0) {
          monthAmounts.push(monthAmount / monthCount);
        }
      }
    });

    const average = days > 0 ? annualAmount / days : 0;
    const maxDailyAverage = Math.max(...monthAmounts);
    const minDailyAverage = Math.min(...monthAmounts);

    return { average, maxDailyAverage, minDailyAverage };
  }

  function createReport() {
    const monthlyReports = createMonthlyReports();
    const { average, maxDailyAverage, minDailyAverage } = getAverages(monthlyReports);

    const chartLabels = getChartLabels();
    const currentReport = monthlyReports.at(-1);
    const lastReport = monthlyReports.at(-2);

    const chartDatases = [
      getDailyDataset(currentReport?.dailyReports || [], lastReport),
      getDailyDataset(currentReport?.dailyReports || [], lastReport, false),
      averageDataset('Max', maxDailyAverage, chartLabels.length, 'max'),
      averageDataset('Anual', average, chartLabels.length),
      averageDataset('Min', minDailyAverage, chartLabels.length, 'min'),
    ];

    setDailyChartData({ labels: chartLabels, datasets: chartDatases });
    setIsUpdated(true);
    setIsFirst(false);
    setMonthlyReports(monthlyReports);
  }

  useEffect(() => {
    setIsUpdated(false);
  }, [allInvoices, storeSelected]);

  return (
    <div className="mb-20 min-h-[300px] bg-gray-200 bg-opacity-90 px-4 pb-2 pt-6 dark:bg-dark">
      <header className="mb-4">
        <h2 className="mb-1 text-center text-2xl font-bold text-dark dark:text-light">Reporte promedio diario</h2>
        <p className="mb-2 text-center text-sm italic">
          Esta grafica tiene como objetivo mostrar la evolución del mes actual contra los meses anteriores en cada una
          de las categorías
        </p>
      </header>

      <ProtectWrapper>
        {/* CONTROLS */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Select
            defaultValue="all"
            value={storeSelected}
            onChange={setStoreSelected}
            data={[
              { label: 'Todos los locales', value: 'all' },
              ...(premiseStores
                ? premiseStores.map(store => ({
                    label: store.name,
                    value: store.id,
                  }))
                : []),
            ]}
            size="xs"
          />

          <Button
            onClick={createReport}
            className="self-center"
            color={isUpdated ? 'green' : 'orange'}
            leftIcon={<IconChartArcs3 />}
            size="xs"
          >
            {isFirst ? 'Generar Informe' : 'Actualizar Informe'}
          </Button>
        </div>

        <div className="relative mb-8 h-[50vh] w-full">
          <Line options={lineOptions} data={dailyChartData} />
        </div>

        <Table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Facturas</th>
              <th>Importe</th>
              <th>
                <div className="flex flex-col items-center">
                  <h2>Promedio Diario</h2>
                  <p className="text-sm">Mensual</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col items-center">
                  <h2>Promedio Diario</h2>
                  <p className="text-sm">Anual</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyReports.map(report => (
              <tr key={report.name}>
                <td>{report.name}</td>
                <td className="text-center">{report.invoices.length}</td>
                <td className="text-right">{currencyFormat(report.amount)}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-x-2">
                    <span>{currencyFormat(report.getDailyAverage())}</span>
                    {Boolean(report.dailyAverageGrowth) && (
                      <span
                        className={`text-xs ${
                          report.dailyAverageGrowth && report.dailyAverageGrowth > 0
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        }`}
                      >
                        {report.getDailyAverageGrowth()}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-x-2">
                    <span>{currencyFormat(report.getAnnualDailyAverage())}</span>
                    {Boolean(report.annualDailyAverageGrowth) && (
                      <span
                        className={`text-xs ${
                          report.annualDailyAverageGrowth && report.annualDailyAverageGrowth > 0
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        }`}
                      >
                        {report.getAnnualDailyAverageGrowth()}%
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ProtectWrapper>
    </div>
  );
}
