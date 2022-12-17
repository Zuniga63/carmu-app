import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { ICreditEvolutionReport } from 'types';
import {
  ChartPeriod,
  CHART_COLORS,
  currencyFormat,
  MONTHS,
  transparentize,
} from 'utils';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Props {
  creditReport: ICreditEvolutionReport;
  period: string | null;
  monthSelected: string | null;
}

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
          if (context.parsed.y !== null)
            label += currencyFormat(context.parsed.y);

          return label;
        },
        afterLabel(tooltipItem) {
          let afterLabel = '';
          const { dataset, dataIndex, parsed } = tooltipItem;

          if (dataIndex > 0) {
            const initialBalance = dataset.data[0];
            const lastBalance = dataset.data[dataIndex - 1];

            if (lastBalance && typeof lastBalance === 'number') {
              const diff = Number(parsed.y) - lastBalance;
              const percentage = Math.round((diff / Number(lastBalance)) * 100);

              if (
                !isNaN(percentage) &&
                isFinite(percentage) &&
                percentage !== 0
              ) {
                afterLabel += 'Parcial: ';
                afterLabel += percentage > 0 ? '+' : '-';
                afterLabel += `${Math.abs(percentage)}% (${currencyFormat(
                  diff
                )})`;
              }
            }

            if (
              dataIndex > 1 &&
              initialBalance &&
              typeof initialBalance === 'number' &&
              initialBalance > 0
            ) {
              const balanceDiff = Number(parsed.y) - initialBalance;
              const fraction = balanceDiff / initialBalance;
              const percentage = Math.round(fraction * 1000) / 10;

              if (
                !isNaN(percentage) &&
                isFinite(percentage) &&
                percentage !== 0
              ) {
                afterLabel += '\nGlobal: ';
                afterLabel += percentage > 0 ? '+' : '-';
                afterLabel += `${Math.abs(percentage)}% (${currencyFormat(
                  balanceDiff
                )})`;
              }
            }
          }

          return afterLabel;
        },
      },
    },
  },
};

const CreditEvolutionChart = ({
  creditReport,
  period,
  monthSelected,
}: Props) => {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  const getLabels = (): string[] => {
    const today = dayjs();
    const month = Number(monthSelected);
    const lastYear = String(today.subtract(1, 'year').year());
    const labels: string[] = [];

    if (period === ChartPeriod.annual) {
      labels.push(lastYear);
      labels.push(...MONTHS.map(month => month.slice(0, 3)));
    } else if (period === ChartPeriod.monthly && !isNaN(month)) {
      labels.push(month > 0 ? MONTHS[month - 1].slice(0, 3) : lastYear);
      const daysInMonth = today.month(month).daysInMonth();
      for (let day = 1; day <= daysInMonth; day += 1)
        labels.push(day < 10 ? '0'.concat(String(day)) : String(day));
    }

    return labels;
  };

  const createDataset = (
    label: string,
    data: (number | null)[],
    color: string,
    opacity = 1,
    hidden = false
  ): ChartDataset<'line'> => {
    return {
      label,
      data,
      borderColor: color,
      fill: true,
      backgroundColor: transparentize(color, opacity),
      tension: 0.1,
      pointBorderWidth: 1,
      hidden,
    };
  };

  const getAnnualDatasets = () => {
    const datasets: ChartDataset<'line'>[] = [];

    let creditsSum = 0;
    let paymentsSum = 0;
    let balance = creditReport.initialBalance;

    const balanceDataset = createDataset(
      'Saldo',
      [balance],
      CHART_COLORS.burgundy,
      0.9
    );
    const paymentDataset = createDataset(
      'Abonos',
      [paymentsSum],
      CHART_COLORS.forestGreen,
      0.9,
      true
    );
    const creditDataset = createDataset(
      'Creditos',
      [creditsSum],
      CHART_COLORS.red,
      0.9,
      true
    );

    const today = dayjs();
    let date = today.startOf('year');

    while (date.isSameOrBefore(today)) {
      const startMonth = date.startOf('month');
      const endMonth = date.endOf('month');

      creditReport.dailyReports.forEach(({ date, credits, payments }) => {
        const reportDate = dayjs(date);
        if (reportDate.isBefore(startMonth) || reportDate.isAfter(endMonth))
          return;

        creditsSum += credits;
        paymentsSum += payments;
        balance += credits - payments;
      });

      balanceDataset.data.push(balance);
      creditDataset.data.push(creditsSum);
      paymentDataset.data.push(paymentsSum);

      date = date.add(1, 'month');
    }

    datasets.push(balanceDataset, creditDataset, paymentDataset);

    return datasets;
  };

  const getMonthlyDatasets = () => {
    const datasets: ChartDataset<'line'>[] = [];
    const month = Number(monthSelected);

    const balanceDataset = createDataset(
      'Saldo',
      [],
      CHART_COLORS.burgundy,
      0.9
    );
    const paymentDataset = createDataset(
      'Abonos',
      [0],
      CHART_COLORS.forestGreen,
      0.9,
      true
    );
    const creditDataset = createDataset(
      'Creditos',
      [0],
      CHART_COLORS.red,
      0.9,
      true
    );

    if (!isNaN(month) && month >= 0 && month < 12) {
      const today = dayjs();
      let currentDate = dayjs().month(month).startOf('month');
      const startMonth = currentDate.clone();
      let endMonth = currentDate.endOf('month');
      if (endMonth.isAfter(today)) endMonth = today;

      let balance = creditReport.initialBalance;
      let payments = 0;
      let credits = 0;

      // Calculate the balance before month selected
      creditReport.dailyReports.forEach(dailyReports => {
        if (dayjs(dailyReports.date).isSameOrAfter(startMonth)) return;
        balance += dailyReports.balance;
      });

      balanceDataset.data.push(balance);

      // Get the daily report of month
      const dailyReports = creditReport.dailyReports.filter(({ date }) => {
        const dailyDate = dayjs(date);
        return (
          dailyDate.isSameOrAfter(startMonth) &&
          dailyDate.isSameOrBefore(endMonth)
        );
      });

      console.log(dailyReports);

      while (currentDate.isSameOrBefore(endMonth)) {
        const startDay = currentDate.startOf('day');
        const endDay = currentDate.endOf('day');

        const dailyReport = dailyReports.find(({ date }) => {
          const dailyDate = dayjs(date);
          return (
            dailyDate.isSameOrAfter(startDay) &&
            dailyDate.isSameOrBefore(endDay)
          );
        });

        if (dailyReport) {
          payments += dailyReport.payments;
          credits += dailyReport.credits;
          balance += dailyReport.balance;
        }

        paymentDataset.data.push(payments);
        creditDataset.data.push(credits);
        balanceDataset.data.push(balance);

        currentDate = currentDate.add(1, 'day');
      }

      datasets.push(balanceDataset, creditDataset, paymentDataset);
    }

    return datasets;
  };

  useEffect(() => {
    const labels = getLabels();
    let datasets: ChartDataset<'line'>[] = [];

    if (period === ChartPeriod.annual) datasets = getAnnualDatasets();
    else if (period === ChartPeriod.monthly) datasets = getMonthlyDatasets();

    setChartData({ labels, datasets });
  }, [creditReport, period, monthSelected]);

  return (
    <div className="relative h-96 w-full 3xl:h-[60vh]">
      {chartData ? <Line options={lineOptions} data={chartData} /> : null}
    </div>
  );
};

export default CreditEvolutionChart;
