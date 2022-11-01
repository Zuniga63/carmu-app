import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAppSelector } from 'store/hooks';
import { IInvoice } from 'types';
import { CHART_COLORS, currencyFormat, transparentize } from 'utils';

export const barOptions: ChartOptions<'bar'> = {
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
    title: {
      text: 'Resumen semanal',
      display: true,
    },
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label(context) {
          let label = context.dataset.label || '';

          if (label) label += ': ';
          if (context.parsed.y !== null) label += currencyFormat(context.parsed.y);

          return label;
        },
      },
    },
  },
};

const WeeklyInvoiceChart = () => {
  const { invoices } = useAppSelector(state => state.InvoicePageReducer);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });

  const getLabels = (): string[] => {
    const labels: string[] = [];
    const now = dayjs();
    let date = now.subtract(1, 'week');

    while (date.isBefore(now) || date.isSame(now)) {
      labels.push(date.format('dddd'));
      date = date.add(1, 'day');
    }

    return labels;
  };

  const getDatasets = (weeklyInvoices: IInvoice[]) => {
    const datasets: ChartDataset<'bar'>[] = [];

    const invoicedDataset: ChartDataset<'bar'> = {
      label: 'Facturado',
      data: [],
      borderColor: CHART_COLORS.indigo,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.indigo, 0.6),
    };
    const soldDataset: ChartDataset<'bar'> = {
      label: 'Efectivo',
      data: [],
      borderColor: CHART_COLORS.green,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.green, 0.6),
      hidden: true,
    };
    const separatedDataset: ChartDataset<'bar'> = {
      label: 'Apartado',
      data: [],
      borderColor: CHART_COLORS.blue,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.blue, 0.6),
      hidden: true,
    };
    const loanDataset: ChartDataset<'bar'> = {
      label: 'Credito',
      data: [],
      borderColor: CHART_COLORS.red,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.red, 0.6),
      hidden: true,
    };

    const today = dayjs();
    let date = today.subtract(1, 'week');

    while (date.isBefore(today) || date.isSame(today)) {
      const startDay = date.startOf('day');
      const endDay = date.endOf('day');

      let amount = 0;
      let sold = 0;
      let loan = 0;
      let separated = 0;

      weeklyInvoices.forEach(invoice => {
        const invoiceDate = dayjs(invoice.expeditionDate);
        if (invoiceDate.isBefore(startDay) || invoiceDate.isAfter(endDay)) return;

        amount += invoice.amount;
        sold += (invoice.cash || 0) - (invoice.cashChange || 0);
        if (invoice.isSeparate) separated += invoice.balance || 0;
        else if (invoice.balance) loan += invoice.balance;
        else if (!invoice.cashChange) loan += invoice.amount - (invoice.cash || 0);
      });

      invoicedDataset.data.push(amount);
      soldDataset.data.push(sold);
      separatedDataset.data.push(separated);
      loanDataset.data.push(loan);

      date = date.add(1, 'day');
    }

    datasets.push(invoicedDataset, soldDataset, separatedDataset, loanDataset);

    return datasets;
  };

  useEffect(() => {
    const labels = getLabels();
    const weekAgo = dayjs().subtract(1, 'week');

    const weekAgoInvoices = invoices.filter(({ expeditionDate }) => {
      const expedition = dayjs(expeditionDate);
      return expedition.isAfter(weekAgo) || expedition.isSame(weekAgo);
    });

    const datasets = getDatasets(weekAgoInvoices);

    setChartData({ labels, datasets });
  }, [invoices.length]);

  return (
    <div className="relative h-96 w-full 3xl:h-[60vh]">
      <Bar options={barOptions} data={chartData} />
    </div>
  );
};

export default WeeklyInvoiceChart;
