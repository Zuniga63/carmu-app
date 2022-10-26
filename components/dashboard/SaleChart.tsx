import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import { Chart } from 'react-chartjs-2';
import { Button, Select, Skeleton } from '@mantine/core';
import { IconChartArrowsVertical, IconTrashX } from '@tabler/icons';
import { IAnnualReport } from 'types';
import { CHART_COLORS, COLORS, currencyFormat, MONTHS, transparentize } from 'utils';

dayjs.extend(isLeapYear);

const BASE_URL = '/dashboard/sale-report';
const enum Period {
  annual = 'annual',
  monthly = 'monthly',
}
const CHART_DATA_PERIODS = [
  { value: Period.annual, label: 'Anual' },
  { value: Period.monthly, label: 'Mensual' },
];

export const initialOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        callback: function (value, index, ticks) {
          return currencyFormat(value);
        },
      },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';

          if (label) label += ': ';
          if (context.parsed.y !== null) label += currencyFormat(context.parsed.y);

          return label;
        },
      },
    },
  },
};

const SaleChart = () => {
  const [reports, setReports] = useState<IAnnualReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const [period, setPeriod] = useState<string | null>(Period.annual);
  const [monthSelected, setMonthSelected] = useState<string | null>(dayjs().month().toString());
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [options, setOptions] = useState(initialOptions);

  const fetchReport = async (year?: number): Promise<IAnnualReport> => {
    const res = await axios.get<{ report: IAnnualReport }>(BASE_URL, { params: { year: year } });
    return res.data.report;
  };

  const getInitialData = async () => {
    try {
      setLoading(true);
      const report = await fetchReport();
      setReports([report]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addAnnualReport = async () => {
    const lastReport = reports.at(-1);
    const year = lastReport ? lastReport.year - 1 : undefined;
    try {
      setLoadingReport(true);
      const report = await fetchReport(year);
      setReports(current => {
        const list = current.slice();
        list.push(report);
        return list;
      });
    } catch (error) {
      toast.error(`No se pudo cargar el reporte del año ${year}`);
    } finally {
      setLoadingReport(false);
    }
  };

  const removeAnnualReport = () => {
    if (reports.length > 1) {
      setReports(currentList => {
        const list = currentList.slice();
        list.pop();
        return list;
      });
    }
  };

  const getLabels = (leapYear: boolean): string[] => {
    const labels: string[] = [];
    const month = Number(monthSelected);
    // If the period is annual then it is just the names of the months
    // shortened to three characters
    if (period === Period.annual) labels.push(...MONTHS.map(month => month.slice(0, 3)));
    // The labels correspond to the number of day contained
    // in the month selected
    else if (period === Period.monthly && !isNaN(month) && reports.length > 0) {
      let daysInMonth = dayjs().month(month).daysInMonth();
      if (leapYear) daysInMonth += 1;
      for (let day = 1; day <= daysInMonth; day += 1) labels.push(day < 10 ? '0'.concat(String(day)) : String(day));
    }

    return labels;
  };

  const getDatasets = (leapYear: boolean): ChartDataset[] => {
    const datasets: ChartDataset[] = [];
    const month = Number(monthSelected);

    reports.forEach(({ year, monthlyReports }, index) => {
      const color = CHART_COLORS[COLORS[index % COLORS.length] as keyof typeof CHART_COLORS];

      if (period === Period.annual) {
        datasets.push({
          label: String(year),
          type: 'bar',
          data: monthlyReports.map(item => item.amount),
          borderColor: color,
          borderWidth: 2,
          backgroundColor: transparentize(color, 0.6),
        });
      } else if (period === Period.monthly && !isNaN(month) && month >= 0 && month < monthlyReports.length) {
        const { dailyReports, fromDate, toDate } = monthlyReports[month];
        const now = dayjs();
        const data: number[] = [];

        let accumulated = 0;
        let date = dayjs(fromDate);
        let endDate = dayjs(toDate);

        if (date.isSame(now.startOf('month'))) endDate = now;

        while (date.isBefore(endDate)) {
          const dailyReport = dailyReports.find(daily => dayjs(daily.fromDate).isSame(date));
          if (dailyReport) accumulated += dailyReport.amount;
          data.push(accumulated);
          date = date.add(1, 'day');
        }
        datasets.push({
          label: String(year),
          type: 'line',
          data: data,
          borderColor: color,
          fill: false,
          tension: 0.2,
          pointBorderWidth: 1,
        });
      }
    });

    return datasets;
  };

  const updateOptions = () => {
    if (period === Period.annual) setOptions(initialOptions);
    else {
      const { plugins: initialPlugins, scales: initialScales } = initialOptions;

      const scales = { ...initialScales, x: { beginAtZero: true } };
      const plugins: typeof initialPlugins = {
        ...initialPlugins,
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

                if (!isNaN(percentage) && percentage > 0) {
                  afterLabel += `+${percentage}% (${currencyFormat(diff)})`;
                }
              }
              return afterLabel;
            },
          },
        },
      };

      setOptions(currentOptions => {
        return { ...currentOptions, scales, plugins };
      });
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    if (reports.length) {
      const leapYear = reports.map(({ year }) => dayjs().year(year).isLeapYear()).some(item => item === true);
      const labels = getLabels(leapYear);
      const datasets = getDatasets(leapYear);
      updateOptions();

      setChartData({
        labels,
        datasets,
      });
    }
  }, [reports.length, period, monthSelected]);

  return (
    <Skeleton visible={loading}>
      <div className="min-h-[300px] bg-dark bg-opacity-90 px-4 py-6">
        <header className="mb-4">
          <h2 className="mb-1 text-center text-2xl font-bold text-light">Reporte de Venta Directa</h2>
          <p className="text-center text-sm italic">
            Representa las ventas en efectivo por mostrador y pagos iniciales de apartados y creditos
          </p>
        </header>

        <div className="grid grid-cols-3 gap-4">
          {/* MAIN CHART */}
          <div className="col-span-2">
            <div className="mb-4 flex justify-evenly">
              <Select value={period} data={CHART_DATA_PERIODS} onChange={setPeriod} size="xs" />
              <Select
                value={monthSelected}
                data={MONTHS.map((name, index) => ({ value: index.toString(), label: name }))}
                onChange={setMonthSelected}
                size="xs"
                disabled={period === Period.annual}
              />
            </div>
            {/* CHART */}
            <div className="relative h-96">
              {chartData && (
                <Chart type={period === Period.annual ? 'bar' : 'line'} options={options} data={chartData} />
              )}
            </div>
          </div>
          {/* CATEGORIES AND TAGS */}
          <div className="border">
            {reports.map(report => (
              <div key={report.year} className="border">
                <h3 className="text-center">{report.year}</h3>
                <p className="text-center">{currencyFormat(report.amount)}</p>
                <ul>
                  {report.categories.map(category => (
                    <li key={category.category.id} className="flex justify-between">
                      <span>{currencyFormat(category.category.name)}: </span>
                      <span>{currencyFormat(category.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* controllers */}
          <div className="col-span-3 flex gap-x-2">
            <Button onClick={addAnnualReport} loading={loadingReport} leftIcon={<IconChartArrowsVertical size={16} />}>
              Agregar año
            </Button>
            <Button onClick={removeAnnualReport} color="red" leftIcon={<IconTrashX size={16} />}>
              Remover año
            </Button>
          </div>
        </div>
      </div>
    </Skeleton>
  );
};

export default SaleChart;
