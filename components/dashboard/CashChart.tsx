import React, { useEffect, useState } from 'react';
import { ChartOptions, ChartData } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CHART_COLORS, currencyFormat, transparentize } from 'utils';
import axios from 'axios';

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

const CashChart = () => {
  const [data, setData] = useState<ChartData | null>(null);

  const buildDataSets = async (): Promise<void> => {
    let data: any[] | null = null;
    try {
      const res = await axios.get('/dashboard/cash-report');
      data = res.data.reports;
    } catch (error) {
      console.log(error);
    }

    if (data) {
      const labels: string[] = [];
      const incomes: number[] = [];
      const averageIncomes: (number | null)[] = [];
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

      setData({
        labels,
        datasets: [
          {
            label: 'Ingresos',
            type: 'bar' as const,
            data: incomes,
            backgroundColor: transparentize(CHART_COLORS.green),
          },
          {
            label: 'Prom.',
            type: 'line' as const,
            borderColor: CHART_COLORS.green,
            borderWidth: 2,
            fill: false,
            data: averageIncomes,
            tension: 0.1,
          },
          {
            label: 'Prom. Anual',
            type: 'line' as const,
            borderColor: transparentize(CHART_COLORS.green),
            borderWidth: 2,
            fill: false,
            data: annualAverageIncomes,
            tension: 0.1,
            hidden: true,
          },
          {
            label: 'Egresos',
            hidden: true,
            type: 'bar' as const,
            data: expenses,
            backgroundColor: transparentize(CHART_COLORS.red),
          },
          {
            label: 'Prom.',
            hidden: true,
            type: 'line' as const,
            borderColor: transparentize(CHART_COLORS.red),
            borderWidth: 2,
            fill: false,
            data: averageExpeses,
          },
          {
            label: 'Prom. Anual',
            hidden: true,
            type: 'line' as const,
            borderColor: transparentize(CHART_COLORS.red),
            borderWidth: 2,
            fill: false,
            data: annualAverageExpenses,
          },
        ],
      });
    }
  };

  useEffect(() => {
    buildDataSets();
  }, []);

  return (
    <div className="relative h-96 w-full rounded-md bg-dark bg-opacity-90 px-4 py-2">
      {data && <Chart type="bar" options={options} data={data} />}
    </div>
  );
};

export default CashChart;
