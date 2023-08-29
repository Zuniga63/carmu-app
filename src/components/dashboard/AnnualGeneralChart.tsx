import React, { useEffect, useState } from 'react';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import { Bar, Line } from 'react-chartjs-2';
import { IAnnualReport } from '@/types';
import { ChartPeriod, CHART_COLORS, COLORS, currencyFormat, MONTHS, transparentize } from '@/utils';

dayjs.extend(isLeapYear);

export const barOptions: ChartOptions<'bar'> = {
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
      position: 'bottom' as const,
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
      beginAtZero: true,
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

interface Props {
  annualReports: IAnnualReport[];
  period: string | null;
  monthSelected: string | null;
}

const AnnualGeneralChart = ({ annualReports, period, monthSelected }: Props) => {
  const [annualChartData, setAnnualChartData] = useState<ChartData<'bar'> | null>(null);
  const [monthlyChartData, setMonthlyChartData] = useState<ChartData<'line'> | null>(null);

  const getLabels = (period: string, leapYear = false, month = NaN, annualReports: IAnnualReport[] = []): string[] => {
    const labels: string[] = [];
    // If the period is annual then it is just the names of the months
    // shortened to three characters
    if (period === ChartPeriod.annual) labels.push(...MONTHS.map(month => month.slice(0, 3)));
    // The labels correspond to the number of day contained
    // in the month selected
    else if (period === ChartPeriod.monthly && !isNaN(month) && annualReports.length > 0) {
      let daysInMonth = dayjs().month(month).daysInMonth();
      if (leapYear && month === 1) daysInMonth += 1;
      for (let day = 1; day <= daysInMonth; day += 1) labels.push(day < 10 ? '0'.concat(String(day)) : String(day));
    }

    return labels;
  };

  const getAnnualDatasets = (annualReports: IAnnualReport[]): ChartDataset<'bar'>[] => {
    const datasets: ChartDataset<'bar'>[] = [];

    annualReports.forEach(({ year, monthlyReports }, index) => {
      const color = CHART_COLORS[COLORS[index % COLORS.length] as keyof typeof CHART_COLORS];
      datasets.push({
        label: String(year),
        data: monthlyReports.map(item => item.amount),
        borderColor: color,
        borderWidth: 2,
        backgroundColor: transparentize(color, 0.6),
      });
    });

    return datasets;
  };

  const getMonthlyDatasets = (annualReports: IAnnualReport[], month: number): ChartDataset<'line'>[] => {
    const datasets: ChartDataset<'line'>[] = [];

    annualReports.forEach(({ year, monthlyReports }, index) => {
      const color = CHART_COLORS[COLORS[index % COLORS.length] as keyof typeof CHART_COLORS];

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
        data: data,
        borderColor: color,
        fill: false,
        tension: 0.2,
        pointBorderWidth: 1,
      });
    });

    return datasets;
  };

  const buildAnnualChartData = () => {
    const labels = getLabels(ChartPeriod.annual);
    const datasets = getAnnualDatasets(annualReports);
    setAnnualChartData({ labels, datasets });
  };

  const buildMonthlyChartData = () => {
    const leapYear = annualReports.map(({ year }) => dayjs().year(year).isLeapYear()).some(item => item === true);
    const month = Number(monthSelected);

    if (!isNaN(month)) {
      const labels = getLabels(ChartPeriod.monthly, leapYear, Number(monthSelected), annualReports);
      const datasets = getMonthlyDatasets(annualReports, month);
      setMonthlyChartData({ labels, datasets });
    } else {
      setMonthlyChartData(null);
    }
  };

  useEffect(() => {
    buildAnnualChartData();
    buildMonthlyChartData();
  }, [annualReports]);

  useEffect(() => {
    if (period === ChartPeriod.monthly) {
      buildMonthlyChartData();
    }
  }, [monthSelected]);

  return (
    <div className="relative h-96 w-full 3xl:h-[60vh]">
      {period === ChartPeriod.annual && annualChartData ? <Bar options={barOptions} data={annualChartData} /> : null}
      {period === ChartPeriod.monthly && monthlyChartData ? (
        <Line options={lineOptions} data={monthlyChartData} />
      ) : null}
    </div>
  );
};

export default AnnualGeneralChart;
