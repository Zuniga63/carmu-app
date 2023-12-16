import React, { useEffect, useState } from 'react';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartPeriod, CHART_COLORS, currencyFormat, MONTHS } from '@/lib/utils';
import { IAnnualReport } from '@/types';

interface Props {
  title: string;
  description?: string;
  annualReports: IAnnualReport[];
  period: string | null;
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
  labels: [],
  datasets: [],
};

const AnnualGeneralAux = ({ title, description, annualReports, period }: Props) => {
  const [chartData, setChartData] = useState(initialDoughnutData);

  const getLabels = (period: string | null, annualReports: IAnnualReport[]) => {
    let labels: string[] = [];
    if (period && period === ChartPeriod.monthly) labels = MONTHS.map(month => month.slice(0, 3));
    else labels = annualReports.map(({ year }) => String(year));

    return labels;
  };

  const getDatasets = (period: string | null, annualReports: IAnnualReport[]) => {
    const datasets: ChartDataset<'doughnut', number[]>[] = [];

    if (period && period === ChartPeriod.monthly) {
      annualReports.forEach(({ year, monthlyReports }) => {
        datasets.push({
          label: String(year),
          backgroundColor: Object.values(CHART_COLORS),
          data: monthlyReports.map(({ amount }) => amount),
        });
      });
    } else {
      datasets.push({
        label: 'Ventas anuales',
        backgroundColor: Object.values(CHART_COLORS),
        data: annualReports.map(report => report.amount),
      });
    }

    return datasets;
  };

  useEffect(() => {
    if (annualReports.length > 0) {
      const labels = getLabels(period, annualReports);
      const datasets = getDatasets(period, annualReports);

      setChartData({ labels, datasets });
    } else {
      setChartData(initialDoughnutData);
    }
  }, [annualReports, period]);

  return (
    <div>
      <header className="rounded-t-md bg-gray-300 px-4 py-2 dark:bg-header">
        <h2 className="mb-1 text-center text-sm font-bold tracking-wider text-dark dark:text-light">{title}</h2>
        {description && <p className="text-center text-xs italic text-neutral-400">{description}</p>}
      </header>
      <div className="relative h-80 border-x-4 border-b-4 border-gray-300 px-2 dark:border-header">
        <Chart type="doughnut" options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default AnnualGeneralAux;
