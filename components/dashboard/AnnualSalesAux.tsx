import React, { useEffect, useState } from 'react';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CHART_COLORS, currencyFormat } from 'utils';
import { IAnnualReport } from 'types';
import { Button } from '@mantine/core';
import { IconChartArrowsVertical, IconTrashX } from '@tabler/icons';

interface Props {
  title: string;
  description?: string;
  annualReports: IAnnualReport[];
  loadingReport: boolean;
  addAnnualReport(): Promise<void>;
  removeAnnualReport(): void;
}

export const initialOptions: ChartOptions<'doughnut'> = {
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

const AnnualSalesAux = ({
  title,
  description,
  annualReports,
  addAnnualReport,
  removeAnnualReport,
  loadingReport,
}: Props) => {
  const [annualSales, setAnnualSales] = useState(initialDoughnutData);

  const buildAnnualSales = () => {
    const chartData = { ...initialDoughnutData };
    chartData.labels = annualReports.map(report => String(report.year));
    chartData.datasets = [
      {
        label: 'Ventas anuales',
        backgroundColor: Object.values(CHART_COLORS),
        data: annualReports.map(report => report.amount),
      },
    ];

    setAnnualSales(chartData);
  };

  useEffect(() => {
    buildAnnualSales();
  }, [annualReports]);

  return (
    <div>
      {/* ANNUAL SALES */}
      <div className="mb-10">
        <header className="rounded-t-md bg-header px-4 py-2">
          <h2 className="mb-1 text-center text-sm font-bold tracking-wider">{title}</h2>
          {description && <p className="text-center text-xs italic text-neutral-400">{description}</p>}
        </header>
        <div className="relative h-64 border-x-4 border-header px-2">
          <Chart type="doughnut" options={initialOptions} data={annualSales} />
        </div>
        <footer className="rounded-b.md flex justify-between bg-header px-2 py-3">
          <Button onClick={addAnnualReport} loading={loadingReport} leftIcon={<IconChartArrowsVertical size={16} />}>
            Agregar año
          </Button>
          <Button onClick={removeAnnualReport} color="red" leftIcon={<IconTrashX size={16} />}>
            Remover año
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default AnnualSalesAux;
