import React, { useEffect, useState } from 'react';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { CHART_COLORS, currencyFormat } from '@/lib/utils';
import { IAnnualReport, ICategoryReport } from '@/types';
import { Button, Select } from '@mantine/core';
import { IconChartDonut, IconX } from '@tabler/icons-react';
import { Chart } from 'react-chartjs-2';

interface Props {
  annualReports: IAnnualReport[];
}

interface CategoryData {
  categories: string[];
  annualReports: {
    year: string;
    categoryReports: ICategoryReport[];
  }[];
}

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  circumference: 180,
  rotation: 270,
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
        afterLabel(tooltipItem) {
          return tooltipItem.dataset.label || 'foo';
        },
      },
    },
  },
};

const initalData: CategoryData = {
  categories: [],
  annualReports: [],
};

const AnnualCategoryChart = ({ annualReports }: Props) => {
  const [chartData, setChartData] = useState<ChartData<'doughnut'> | null>(null);
  const [categoryData, setCategoryData] = useState(initalData);
  const [yearSelected, selectYear] = useState<string | null>(null);
  const [categoryReports, setCategoryReports] = useState<ICategoryReport[]>([]);

  const addCategory = (categoryId: string | null) => {
    const categories = categoryData.categories.slice();
    const categoryAnnualReports = categoryData.annualReports.slice();

    if (yearSelected && categoryId) {
      if (categoryId !== 'all') {
        const categoryReportToAdd = categoryReports.find(report => report.category.id === categoryId);

        if (categoryReportToAdd) {
          const { category: categoryToAdd } = categoryReportToAdd;
          const annualReport = categoryAnnualReports.find(report => report.year === yearSelected);

          // Add category name if not exits
          if (!categories.some(categoryName => categoryName === categoryToAdd.name)) {
            categories.push(categoryToAdd.name);
          }

          // Add category report to year if no existe in the category reports
          if (annualReport) {
            const exists = annualReport.categoryReports.some(report => report.category.id === categoryId);
            if (!exists) annualReport.categoryReports.push(categoryReportToAdd);
          } else {
            categoryAnnualReports.push({
              year: yearSelected,
              categoryReports: [categoryReportToAdd],
            });
          }
        }
      } else {
        categoryReports.forEach(categoryReportToAdd => {
          const { category: categoryToAdd } = categoryReportToAdd;
          const annualReport = categoryAnnualReports.find(report => report.year === yearSelected);

          // Add category name if not exits
          if (!categories.some(categoryName => categoryName === categoryToAdd.name)) {
            categories.push(categoryToAdd.name);
          }

          // Add category report to year if no existe in the category reports
          if (annualReport) {
            const exists = annualReport.categoryReports.some(report => report.category.id === categoryId);
            if (!exists) annualReport.categoryReports.push(categoryReportToAdd);
          } else {
            categoryAnnualReports.push({
              year: yearSelected,
              categoryReports: [categoryReportToAdd],
            });
          }
        });
      }
    }

    setCategoryData({ categories, annualReports: categoryAnnualReports });
  };

  const removeCategory = () => {
    const categories = categoryData.categories.slice();
    const reports: typeof categoryData.annualReports = [];

    if (categories.length > 0) {
      const lastCategory = categories.pop();

      categoryData.annualReports.forEach(annualReport => {
        const categoryReports = annualReport.categoryReports.filter(({ category }) => category.name !== lastCategory);
        if (categoryReports.length > 0) {
          reports.push({
            year: annualReport.year,
            categoryReports,
          });
        }
      });
    }

    setCategoryData({ categories, annualReports: reports });
  };

  const removeYear = () => {
    const annualReports = categoryData.annualReports.slice();
    const categories: string[] = [];

    // Remove the las year
    annualReports.pop();

    // Remove innecesary categories
    if (annualReports.length > 0) {
      categoryData.categories.forEach(categoryName => {
        const exists: boolean[] = [];
        annualReports.forEach(({ categoryReports }) => {
          exists.push(categoryReports.some(({ category }) => category.name === categoryName));
        });

        const existsForAtLeastOneYear = exists.some(result => result === true);

        if (existsForAtLeastOneYear) categories.push(categoryName);
      });
    }

    setCategoryData({ categories, annualReports });
  };

  const buildCategoryChartData = () => {
    let newChartData: ChartData<'doughnut'> | null = null;

    if (categoryData.categories.length > 0 && categoryData.annualReports.length > 0) {
      const labels = categoryData.categories.slice();
      const datasets: ChartDataset<'doughnut', number[]>[] = [];

      categoryData.annualReports.forEach(annualReport => {
        const amounts: number[] = [];

        labels.forEach(categoryName => {
          const categoryReport = annualReport.categoryReports.find(report => report.category.name === categoryName);
          const amount = categoryReport?.amount || 0;
          amounts.push(amount);
        });

        datasets.push({
          label: annualReport.year,
          backgroundColor: Object.values(CHART_COLORS),
          data: amounts,
        });
      });

      newChartData = {
        labels,
        datasets,
      };
    }

    setChartData(newChartData);
  };

  useEffect(() => {
    let categories: ICategoryReport[] = [];
    const year = Number(yearSelected);
    if (!isNaN(year)) {
      const annualReport = annualReports.find(report => report.year === year);
      if (annualReport) categories = annualReport.categories.slice();
    }

    categories.sort((lastReport, currentReport) => {
      if (lastReport.amount > currentReport.amount) return -1;
      else if (lastReport.amount < currentReport.amount) return 1;
      return 0;
    });

    setCategoryReports(categories);
  }, [yearSelected]);

  useEffect(buildCategoryChartData, [categoryData]);

  return (
    <div>
      <header className="rounded-t-md bg-gray-300 px-4 py-2 dark:bg-header">
        <h2 className="text-center text-sm font-bold tracking-wider text-dark dark:text-light">Comparativa Anual</h2>
        <p className="mb-2 text-center text-xs italic">Categorías</p>
        {/* Controllers */}
        <div className="flex justify-between gap-2">
          <Select
            value={yearSelected}
            onChange={selectYear}
            data={annualReports.map(report => String(report.year))}
            size="xs"
            placeholder="Año"
          />
          <Select
            value={null}
            onChange={addCategory}
            data={[
              ...categoryReports.map(report => ({
                value: report.category.id,
                label: report.category.name,
              })),
              { value: 'all', label: 'Agregar todas' },
            ]}
            size="xs"
            placeholder="Categoría"
          />
        </div>
      </header>

      <div
        className={`relative h-80 border-x-4 border-gray-300 bg-white px-2 backdrop-blur transition-colors dark:border-header ${
          chartData ? 'bg-opacity-0' : 'bg-opacity-10'
        }`}
      >
        {chartData ? (
          <Chart type="doughnut" options={options} data={chartData} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-y-4">
            <IconChartDonut size={60} />
            <span className="text-sm italic">Agrega una categoría para rederizar una gráfica</span>
          </div>
        )}
      </div>

      <footer className="rounded-b.md flex justify-between bg-gray-300 px-2 py-3 dark:bg-header">
        <Button
          leftIcon={<IconX size={16} />}
          color="violet"
          size="xs"
          disabled={categoryData.categories.length <= 0}
          onClick={removeCategory}
        >
          Quitar Categoría
        </Button>
        <Button
          leftIcon={<IconX size={16} />}
          color="red"
          size="xs"
          disabled={categoryData.annualReports.length <= 0}
          onClick={removeYear}
        >
          Quitar Año
        </Button>
      </footer>
    </div>
  );
};

export default AnnualCategoryChart;
