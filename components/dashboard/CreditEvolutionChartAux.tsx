import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartPeriod, CHART_COLORS, currencyFormat } from 'utils';

import { ICreditEvolutionReport } from 'types';

interface Props {
  creditReport: ICreditEvolutionReport;
  period: string | null;
  monthSelected: string | null;
}

export const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label(tooltipItem) {
          const { label: currentLabel, dataIndex, dataset } = tooltipItem;
          let label = currentLabel || '';
          if (label) label += ': ';
          const value = dataset.data[dataIndex];
          if (value) label += currencyFormat(value);

          return label;
        },
      },
    },
  },
  circumference: 180,
  rotation: 270,
};

const initialDoughnutData: ChartData<'doughnut'> = {
  labels: ['Creditos', 'Abonos'],
  datasets: [],
};

const CreditEvolutionChartAux = ({ creditReport, period, monthSelected }: Props) => {
  const [chartData, setChartData] = useState(initialDoughnutData);

  const getAnnualDatasets = (): ChartDataset<'doughnut'>[] => {
    let totalCredits = 0;
    let totalPayments = 0;

    creditReport.dailyReports.forEach(({ credits, payments }) => {
      totalCredits += credits;
      totalPayments += payments;
    });

    return [
      {
        label: dayjs().year().toString(),
        backgroundColor: [CHART_COLORS.burgundy, CHART_COLORS.forestGreen],
        data: [totalCredits, totalPayments],
      },
    ];
  };

  const getMonthlyDatasets = (): ChartDataset<'doughnut'>[] => {
    const month = Number(monthSelected);

    let totalCredits = 0;
    let totalPayments = 0;

    if (!isNaN(month) && month >= 0 && month < 12) {
      const startMonth = dayjs().month(month).startOf('month');
      const endMonth = startMonth.endOf('month');
      creditReport.dailyReports.forEach(report => {
        const date = dayjs(report.date);
        if (date.isBefore(startMonth) || date.isAfter(endMonth)) return;

        totalCredits += report.credits;
        totalPayments += report.payments;
      });
    }

    return [
      {
        label: 'Comparativa menusal',
        backgroundColor: [CHART_COLORS.burgundy, CHART_COLORS.forestGreen],
        data: [totalCredits, totalPayments],
      },
    ];
  };

  useEffect(() => {
    let datasets: ChartDataset<'doughnut'>[] = [];
    if (period === ChartPeriod.annual) datasets = getAnnualDatasets();
    else if (period === ChartPeriod.monthly) datasets = getMonthlyDatasets();

    setChartData(current => ({ ...current, datasets }));
  }, [creditReport, period, monthSelected]);

  return (
    <div>
      <header className="rounded-t-md bg-gray-300 px-4 py-2 dark:bg-header">
        <h2 className="mb-1 text-center text-sm font-bold tracking-wider">Credito vs Abonos</h2>
        <p className="text-center text-xs italic dark:text-neutral-400">
          Muestra una comparativa entre los creditos otorgados y los abonos recibidos
        </p>
      </header>
      <div className="relative h-72 border-x-4 border-b-4 border-neutral-300 px-2 dark:border-header">
        <Doughnut options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default CreditEvolutionChartAux;
