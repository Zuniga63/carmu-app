import React, { useEffect, useState } from 'react';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import { Chart } from 'react-chartjs-2';
import { IAnnualReport } from 'types';
import { CHART_COLORS, COLORS, currencyFormat, MONTHS, transparentize } from 'utils';

dayjs.extend(isLeapYear);

const enum Period {
  annual = 'annual',
  monthly = 'monthly',
}

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

interface Props {
  annualReports: IAnnualReport[];
  period: string | null;
  monthSelected: string | null;
}

const AnnualGeneralChart = ({ annualReports, period, monthSelected }: Props) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [options, setOptions] = useState(initialOptions);

  const getLabels = (leapYear: boolean): string[] => {
    const labels: string[] = [];
    const month = Number(monthSelected);
    // If the period is annual then it is just the names of the months
    // shortened to three characters
    if (period === Period.annual) labels.push(...MONTHS.map(month => month.slice(0, 3)));
    // The labels correspond to the number of day contained
    // in the month selected
    else if (period === Period.monthly && !isNaN(month) && annualReports.length > 0) {
      let daysInMonth = dayjs().month(month).daysInMonth();
      if (leapYear && month === 1) daysInMonth += 1;
      for (let day = 1; day <= daysInMonth; day += 1) labels.push(day < 10 ? '0'.concat(String(day)) : String(day));
    }

    return labels;
  };

  const getDatasets = (leapYear: boolean): ChartDataset[] => {
    const datasets: ChartDataset[] = [];
    const month = Number(monthSelected);

    annualReports.forEach(({ year, monthlyReports }, index) => {
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
    if (annualReports.length) {
      const leapYear = annualReports.map(({ year }) => dayjs().year(year).isLeapYear()).some(item => item === true);
      const labels = getLabels(leapYear);
      const datasets = getDatasets(leapYear);
      updateOptions();

      setChartData({
        labels,
        datasets,
      });
    }
  }, [annualReports.length, period, monthSelected]);

  return (
    <div className="relative h-96 w-full 3xl:h-[60vh]">
      {chartData && <Chart type={period === Period.annual ? 'bar' : 'line'} options={options} data={chartData} />}
    </div>
  );
};

export default AnnualGeneralChart;
