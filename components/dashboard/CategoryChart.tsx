import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { IAnnualReport } from 'types';
import { ChartPeriod, CHART_COLORS, COLORS, currencyFormat, MONTHS, transparentize } from 'utils';

dayjs.extend(isLeapYear);

interface Props {
  annualReport: IAnnualReport;
  period: string | null;
  month: string | null;
}

interface Category {
  id: string;
  name: string;
  pareto: number; // Pareto law
}

const barOptions: ChartOptions = {
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

const lineOptions: ChartOptions = {
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

const CategoryChart = ({ annualReport, period, month }: Props) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartOptions, setChartOptions] = useState(barOptions);

  const getLabels = (period: string, month: number): string[] => {
    const leapYear = dayjs().year(annualReport.year).isLeapYear();
    const labels: string[] = [];
    // If the period is annual then it is just the names of the months
    // shortened to three characters
    if (period === ChartPeriod.annual) labels.push(...MONTHS.map(monthName => monthName.slice(0, 3)));
    // The labels correspond to the number of day contained
    // in the month selected
    else if (period === ChartPeriod.monthly && !isNaN(month)) {
      let daysInMonth = dayjs().month(month).daysInMonth();
      if (leapYear && month) daysInMonth += 1;
      for (let day = 1; day <= daysInMonth; day += 1) labels.push(day < 10 ? '0'.concat(String(day)) : String(day));
    }

    return labels;
  };

  const getCategories = (annualReport: IAnnualReport): Category[] => {
    const categories: Category[] = [];
    let accumulated = 0;

    // Get individual reports for sort for max to min
    const categoryReports = annualReport.categories.filter(report => report.category.level === 0);
    const totalAmount = categoryReports.reduce((acc, current) => acc + current.amount, 0);

    categoryReports.sort((last, current) => {
      let result = 0;
      if (last.amount > current.amount) result = -1;
      else if (last.amount < current.amount) result = 1;

      return result;
    });

    categoryReports.forEach(({ category, amount }) => {
      accumulated += amount;
      const pareto = Math.floor((accumulated / totalAmount) * 10) * 10;
      console.log(pareto);
      if (category.level === 0) categories.push({ id: category.id, name: category.name, pareto });
    });

    return categories;
  };

  const getDatasets = (
    period: string,
    month: number,
    annualReport: IAnnualReport,
    categories: Category[]
  ): ChartDataset[] => {
    const datasets: ChartDataset[] = [];
    const { monthlyReports } = annualReport;

    if (monthlyReports.length > 0) {
      categories.forEach((category, index) => {
        const data: number[] = [];
        const color = CHART_COLORS[COLORS[index % COLORS.length] as keyof typeof CHART_COLORS];
        const type = period === ChartPeriod.monthly ? 'line' : 'bar';

        if (period === ChartPeriod.annual) {
          // For each category is scrolled monthly and the amount is recovered
          monthlyReports.forEach(report => {
            const categoryReport = report.categories.find(report => report.category.id === category.id);
            data.push(categoryReport?.amount || 0);
          });
        } else if (period === ChartPeriod.monthly && !isNaN(month) && month >= 0) {
          const { dailyReports, fromDate, toDate } = monthlyReports[month];
          const now = dayjs();

          let accumulated = 0;
          let date = dayjs(fromDate);
          let endDate = dayjs(toDate);

          if (date.isSame(now.startOf('month'))) endDate = now;

          while (date.isBefore(endDate)) {
            const dailyReport = dailyReports.find(daily => dayjs(daily.fromDate).isSame(date));
            if (dailyReport) {
              const categoryReport = dailyReport.categories.find(report => report.category.id === category.id);
              if (categoryReport) {
                accumulated += categoryReport.amount;
              }
            }
            data.push(accumulated);
            date = date.add(1, 'day');
          }
          console.log(data);
        }

        datasets.push({
          label: category.name,
          type: type,
          data,
          borderColor: color,
          borderWidth: 2,
          backgroundColor: transparentize(color, 0.6),
          fill: false,
          tension: 0.2,
          pointBorderWidth: 1,
          hidden: category.pareto > 80,
        });
      });
    }

    return datasets;
  };

  useEffect(() => {
    let newChartData: ChartData | null = null;
    let options = barOptions;

    if (annualReport && period && month) {
      const labels = getLabels(period, Number(month));
      const categories = getCategories(annualReport);
      const datasets = getDatasets(period, Number(month), annualReport, categories);

      if (period === ChartPeriod.monthly) options = lineOptions;
      newChartData = { labels, datasets };
    }

    setChartData(newChartData);
    setChartOptions(options);
  }, [annualReport, period, month]);
  return (
    <div className="relative h-96 w-full 3xl:h-[450px]">
      {chartData ? (
        <Chart type={period === ChartPeriod.annual ? 'bar' : 'line'} options={chartOptions} data={chartData} />
      ) : null}
    </div>
  );
};

export default CategoryChart;
