import { Tabs } from '@mantine/core';
import { IconBuildingStore, IconChartBar, IconTable } from '@tabler/icons';
import axios, { CancelTokenSource } from 'axios';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { authSelector } from 'src/features/Auth';
import { invoicePageSelector } from 'src/features/InvoicePage';
import { useAppSelector } from 'src/store/hooks';
import { ISaleHistory } from 'src/types';
import { CHART_COLORS, currencyFormat, transparentize } from 'src/utils';
import AnnualReportStatistics from '../dashboard/AnnualReportStatistics';
import WeeklyHistory from './WeeklyHistory';
import { configSelector } from 'src/features/Config';
import AverageChart from './PremiseStoreComparative/AverageChart';

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
      font: {
        size: 18,
      },
    },
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label(context) {
          let label = context.dataset.label || '';

          if (label) label += ': ';
          if (context.parsed.y !== null)
            label += currencyFormat(context.parsed.y);

          return label;
        },
      },
    },
  },
};

const WeeklyInvoiceChart = () => {
  const { storeSuccess, storePaymentSuccess, refreshIsSuccess } =
    useAppSelector(invoicePageSelector);
  const { isAuth } = useAppSelector(authSelector);
  const { premiseStores } = useAppSelector(configSelector);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });
  const [history, setHistory] = useState<ISaleHistory[]>([]);
  const [initialData, setInitialData] = useState(true);
  const [waiting, setWaiting] = useState(false);

  const CancelToken = axios.CancelToken;
  let source: CancelTokenSource;

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

  const getDatasets = (saleHistory: ISaleHistory[]): ChartDataset<'bar'>[] => {
    const datasets: ChartDataset<'bar'>[] = [];

    const invoicedDataset: ChartDataset<'bar'> = {
      label: 'Facturado',
      data: [],
      borderColor: CHART_COLORS.purple,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.purple, 0.6),
      hidden: false,
    };

    const soldDataset: ChartDataset<'bar'> = {
      label: 'Efectivo',
      data: [],
      borderColor: CHART_COLORS.forestGreen,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.forestGreen, 0.6),
      hidden: true,
    };

    const separateDataset: ChartDataset<'bar'> = {
      label: 'Apartados',
      data: [],
      borderColor: CHART_COLORS.green,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.green, 0.6),
      hidden: true,
    };

    const loanDataset: ChartDataset<'bar'> = {
      label: 'Creditos',
      data: [],
      borderColor: CHART_COLORS.raspberry,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.raspberry, 0.6),
      hidden: true,
    };

    const paymentDataset: ChartDataset<'bar'> = {
      label: 'Abonos',
      data: [],
      borderColor: CHART_COLORS.orange,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.orange, 0.6),
      hidden: true,
    };

    const today = dayjs();
    let date = today.subtract(1, 'week');

    while (date.isBefore(today) || date.isSame(today)) {
      const startDay = date.startOf('day');
      const endDay = date.endOf('day');

      let amount = 0;
      let sold = 0;
      let separates = 0;
      let loan = 0;
      let payments = 0;

      saleHistory.forEach(record => {
        const recordDate = dayjs(record.operationDate);
        const { amount: recordAmount, operationType: recordType } = record;
        if (recordDate.isBefore(startDay) || recordDate.isAfter(endDay)) return;

        if (recordType === 'sale' || recordType === 'separate_payment') {
          amount += recordType === 'sale' ? recordAmount : 0;
          sold += recordAmount;
        } else if (recordType === 'credit') {
          amount += recordAmount;
          loan += recordAmount;
        } else if (recordType === 'separate') {
          amount += recordAmount;
          separates += recordAmount;
        } else if (recordType === 'credit_payment') {
          payments += recordAmount;
        }
      });

      invoicedDataset.data.push(amount);
      soldDataset.data.push(sold);
      loanDataset.data.push(loan);
      paymentDataset.data.push(payments);
      separateDataset.data.push(separates);

      date = date.add(1, 'day');
    }

    datasets.push(
      invoicedDataset,
      soldDataset,
      separateDataset,
      loanDataset,
      paymentDataset
    );

    return datasets;
  };

  const fetchData = async () => {
    const labels = getLabels();
    let datasets: ChartDataset<'bar'>[] = getDatasets([]);
    const weekAgo = dayjs().subtract(1, 'week').startOf('day');

    try {
      setWaiting(true);
      const res = await axios.get<{ history: ISaleHistory[] }>(
        '/sale-history',
        {
          cancelToken: source?.token,
          params: {
            from: weekAgo.toDate(),
          },
        }
      );

      datasets = getDatasets(res.data.history);
      setHistory(res.data.history.reverse());
      if (initialData) setInitialData(false);
    } catch (error) {
      toast.error('Hubo un error y no se pudo cargar los datos de la grafica');
      console.log(error);
    } finally {
      setWaiting(false);
    }

    setChartData({ labels, datasets });
  };

  useEffect(() => {
    if (
      isAuth &&
      (storeSuccess || storePaymentSuccess || refreshIsSuccess || initialData)
    ) {
      if (waiting) source?.cancel('El estado cambió');
      source = CancelToken.source();
      fetchData();
    }
  }, [isAuth, storeSuccess, storePaymentSuccess, refreshIsSuccess]);

  useEffect(() => {
    return () => {
      if (source) {
        source.cancel('Desmontando el componente.');
      }
      setInitialData(true);
    };
  }, []);

  return (
    <Tabs defaultValue="chart" color="blue">
      <Tabs.List>
        <Tabs.Tab value="chart" color="blue" icon={<IconChartBar size={14} />}>
          Reporte Semanal
        </Tabs.Tab>
        <Tabs.Tab value="history" icon={<IconTable size={14} />}>
          Historial
        </Tabs.Tab>
        <Tabs.Tab
          value="annualChart"
          color="blue"
          icon={<IconChartBar size={14} />}
        >
          Reporte Anual
        </Tabs.Tab>
        {premiseStores.length > 0 && (
          <Tabs.Tab
            value="saleByStore"
            color="blue"
            icon={<IconBuildingStore size={14} />}
          >
            Por Negocio
          </Tabs.Tab>
        )}
      </Tabs.List>

      <Tabs.Panel value="chart">
        <div className="mb-16">
          <div className="relative mb-4 h-96 w-full 3xl:h-[60vh]">
            <Bar options={barOptions} data={chartData} />
          </div>

          <ul className="mx-auto w-10/12 text-sm">
            <li className="mb-4 rounded-lg bg-gray-300 px-4 py-2 dark:bg-header">
              <span className="font-bold text-indigo-600">Facturado</span>:
              Corresponde a la suma de los valores de todas las facturas tanto
              por{' '}
              <strong className="font-bold text-emerald-500">
                venta directa
              </strong>{' '}
              y <strong className="font-bold text-red-600">créditos</strong>{' '}
              junto con los pagos individuales de cada uno de los{' '}
              <strong className="font-bold text-cyan-500">apartados</strong>.
            </li>
            <li className="rounded-lg bg-gray-300 px-4 py-2 dark:bg-header">
              <span className="font-bold text-emerald-600">Efectivo</span>: Es
              la suma de los <strong className="font-bold">importes</strong> en
              efectivo de cada una de las facturas,{' '}
              <span className="underline">los pagos iniciales</span> de los{' '}
              <strong className="font-bold text-red-600">créditos</strong>,{' '}
              <span className="underline">los pagos iniciales</span> y abonos de
              los <strong className="font-bold text-cyan-500">apartados</strong>
              .
            </li>
          </ul>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="history" pt={4}>
        <WeeklyHistory history={history} />
      </Tabs.Panel>

      <Tabs.Panel value="annualChart" pt="xs">
        <AnnualReportStatistics
          title="Reporte de Venta Directa"
          description="Se resumen las ventas directas por mostrador u otros medios pagadas en efectivo, tarjeta o transferencia"
        />
      </Tabs.Panel>
      {premiseStores.length > 0 && (
        <Tabs.Panel value="saleByStore" pt="xs">
          <div className="flex flex-col gap-y-4">
            <AverageChart />
          </div>
        </Tabs.Panel>
      )}
    </Tabs>
  );
};

export default WeeklyInvoiceChart;
