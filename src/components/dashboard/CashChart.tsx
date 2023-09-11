import { useCallback, useMemo } from 'react';
import { ChartOptions, ChartData, ChartDataset } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CHART_COLORS, currencyFormat, transparentize } from '@/utils';
import ProtectWrapper from '../ProtectWrapper';
import { useGetCashReports } from '@/hooks/react-query/dashboard.hooks';
import { CashReport } from '@/types';

export const options: ChartOptions = {
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
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Flujo de Caja',
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

type createBarDatasetProps = {
  label: string;
  data: number[];
  color: string;
  hidden?: boolean;
};

type CreateLineDatasetProps = {
  label: string;
  data: number[];
  color: string;
  hidden?: boolean;
  tension?: number;
};

const CashChart = () => {
  const { data } = useGetCashReports();

  const createBarDataset = ({ label, data, color, hidden = false }: createBarDatasetProps): ChartDataset => {
    return {
      label,
      hidden,
      type: 'bar' as const,
      data: data,
      backgroundColor: transparentize(color),
    };
  };

  const createLineDataset = (props: CreateLineDatasetProps): ChartDataset => {
    const { label, data, color, hidden = false, tension } = props;
    return {
      label,
      type: 'line' as const,
      borderColor: transparentize(color),
      borderWidth: 2,
      fill: false,
      data,
      tension,
      hidden,
    };
  };

  const getResume = useCallback((data: CashReport[]) => {
    const labels: string[] = [];
    const incomes: number[] = [];
    const averageIncomes: number[] = [];
    const annualAverageIncomes: number[] = [];
    const expenses: number[] = [];
    const averageExpeses: number[] = [];
    const annualAverageExpenses: number[] = [];

    data.forEach((item, index) => {
      labels.push(item.month);
      incomes.push(item.incomes);
      expenses.push(item.expenses);
      averageIncomes.push(item.averageIncomes);
      averageExpeses.push(item.averageExpenses);
      annualAverageIncomes.push(item.annualAverageIncomes);
      annualAverageExpenses.push(item.annualAverageExpenses);
    });

    return {
      labels,
      incomes,
      averageIncomes,
      annualAverageIncomes,
      expenses,
      averageExpeses,
      annualAverageExpenses,
    };
  }, []);

  const chartData: ChartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };
    const resume = getResume(data);

    return {
      labels: resume.labels,
      datasets: [
        createBarDataset({ label: 'Ingresos', data: resume.incomes, color: CHART_COLORS.green }),
        createLineDataset({ label: 'Prom.', color: CHART_COLORS.green, data: resume.averageIncomes, tension: 0.1 }),
        createLineDataset({
          label: 'Prom. Anual',
          color: CHART_COLORS.green,
          data: resume.annualAverageIncomes,
          hidden: true,
        }),
        createBarDataset({ label: 'Egresos', data: resume.expenses, color: CHART_COLORS.red, hidden: true }),
        createLineDataset({
          label: 'Prom',
          color: CHART_COLORS.red,
          data: resume.averageExpeses,
          hidden: true,
        }),
        createLineDataset({
          label: 'Prom. Anual',
          color: CHART_COLORS.red,
          data: resume.annualAverageExpenses,
          hidden: true,
        }),
      ],
    };
  }, [data]);

  return (
    <ProtectWrapper>
      <div className="relative h-96 w-full rounded-md bg-gray-200 bg-opacity-90 px-4 py-2 dark:bg-dark">
        <Chart type="bar" options={options} data={chartData} />
      </div>
    </ProtectWrapper>
  );
};

export default CashChart;
