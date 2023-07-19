import { ChartData, ChartDataset } from 'chart.js';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { IAnnualReport } from 'src/types';
import { ChartPeriod, CHART_COLORS, COLORS, MONTHS, transparentize } from 'src/utils';
import { barOptions, lineOptions } from './AnnualGeneralChart';

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

const CategoryChart = ({ annualReport, period, month }: Props) => {
  const [annualChartData, setAnnualChartData] = useState<ChartData<'bar'> | null>(null);
  const [monthlyChartData, setMonthlyChartData] = useState<ChartData<'line'> | null>(null);

  const getLabels = (period: string, month = NaN, annualReport?: IAnnualReport): string[] => {
    const labels: string[] = [];
    // If the period is annual then it is just the names of the months
    // shortened to three characters
    if (period === ChartPeriod.annual) labels.push(...MONTHS.map(monthName => monthName.slice(0, 3)));
    // The labels correspond to the number of day contained
    // in the month selected
    else if (period === ChartPeriod.monthly && !isNaN(month) && annualReport) {
      const leapYear = dayjs().year(annualReport.year).isLeapYear();
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
      if (category.level === 0) categories.push({ id: category.id, name: category.name, pareto });
    });

    return categories;
  };

  const getAnnualDatasets = (categories: Category[], annualReport: IAnnualReport): ChartDataset<'bar'>[] => {
    const datasets: ChartDataset<'bar'>[] = [];
    const { monthlyReports } = annualReport;
    if (monthlyReports.length > 0) {
      categories.forEach((category, index) => {
        const data: number[] = [];
        const colors = CHART_COLORS[COLORS[index % COLORS.length] as keyof typeof CHART_COLORS];
        // For each category is scrolled monthly and the amount is recovered
        monthlyReports.forEach(report => {
          const categoryReport = report.categories.find(report => report.category.id === category.id);
          data.push(categoryReport?.amount || 0);
        });

        datasets.push({
          label: category.name,
          data,
          borderColor: colors,
          borderWidth: 2,
          backgroundColor: transparentize(colors, 0.6),
          hidden: categories.length > 3 && category.pareto > 80,
        });
      });
    }

    return datasets;
  };

  const getMonthlyDatasets = (
    categories: Category[],
    annualReport: IAnnualReport,
    month: number,
  ): ChartDataset<'line'>[] => {
    const datasets: ChartDataset<'line'>[] = [];
    const { monthlyReports } = annualReport;

    if (monthlyReports.length > 0 && !isNaN(month) && month >= 0) {
      categories.forEach((category, index) => {
        const data: number[] = [];
        const colors = CHART_COLORS[COLORS[index % COLORS.length] as keyof typeof CHART_COLORS];

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

        datasets.push({
          label: category.name,
          data,
          borderColor: colors,
          borderWidth: 2,
          backgroundColor: transparentize(colors, 0.6),
          fill: false,
          tension: 0.2,
          pointBorderWidth: 1,
          hidden: categories.length > 3 && category.pareto > 80,
        });
      });
    }

    return datasets;
  };

  const buildAnnualChartData = (categories: Category[]) => {
    const labels = getLabels(ChartPeriod.annual);
    const datasets = getAnnualDatasets(categories, annualReport);
    setAnnualChartData({ labels, datasets });
  };

  const buildMonthlyChartData = (categories: Category[]) => {
    const labels = getLabels(ChartPeriod.monthly, Number(month), annualReport);
    const datasets = getMonthlyDatasets(categories, annualReport, Number(month));
    setMonthlyChartData({ labels, datasets });
  };

  useEffect(() => {
    const categories = getCategories(annualReport);

    buildAnnualChartData(categories);
    buildMonthlyChartData(categories);
  }, []);

  useEffect(() => {
    if (period === ChartPeriod.monthly) {
      const categories = getCategories(annualReport);
      buildMonthlyChartData(categories);
    }
  }, [month]);

  return (
    <div className="relative h-96 w-full 3xl:h-[60vh]">
      {period === ChartPeriod.annual && annualChartData ? <Bar options={barOptions} data={annualChartData} /> : null}
      {period === ChartPeriod.monthly && monthlyChartData ? (
        <Line options={lineOptions} data={monthlyChartData} />
      ) : null}
    </div>
  );
};

export default CategoryChart;
