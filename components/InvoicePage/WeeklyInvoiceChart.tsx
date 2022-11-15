import { ScrollArea, Table } from '@mantine/core';
import axios, { CancelTokenSource } from 'axios';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { useAppSelector } from 'store/hooks';
import { ISaleHistory } from 'types';
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

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const WeeklyInvoiceChart = () => {
  const { invoices } = useAppSelector(state => state.InvoicePageReducer);
  const { isAuth } = useAppSelector(state => state.AuthReducer);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });
  const [history, setHistory] = useState<ISaleHistory[]>([]);

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

    const paymentDataset: ChartDataset<'bar'> = {
      label: 'Abonos',
      data: [],
      borderColor: CHART_COLORS.forestGreen,
      borderWidth: 2,
      backgroundColor: transparentize(CHART_COLORS.forestGreen, 0.6),
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
      let payments = 0;

      saleHistory.forEach(record => {
        const recordDate = dayjs(record.operationDate);
        if (recordDate.isBefore(startDay) || recordDate.isAfter(endDay)) return;

        if (record.operationType === 'sale') {
          sold += record.amount;
          amount += record.amount;
        } else if (record.operationType === 'credit') {
          loan += record.amount;
          amount += record.amount;
        } else if (record.operationType === 'separate') {
          separated += record.amount;
          amount += record.amount;
        } else if (record.operationType === 'credit_payment' || record.operationType === 'separate_payment') {
          payments += record.amount;
        }
      });

      // weeklyInvoices.forEach(invoice => {
      //   const invoiceDate = dayjs(invoice.expeditionDate);
      //   if (invoiceDate.isBefore(startDay) || invoiceDate.isAfter(endDay)) return;

      //   amount += invoice.amount;
      //   sold += (invoice.cash || 0) - (invoice.cashChange || 0);
      //   if (invoice.isSeparate) separated += invoice.balance || 0;
      //   else if (invoice.balance) loan += invoice.balance;
      //   else if (!invoice.cashChange) loan += invoice.amount - (invoice.cash || 0);
      // });

      invoicedDataset.data.push(amount);
      soldDataset.data.push(sold);
      separatedDataset.data.push(separated);
      loanDataset.data.push(loan);
      paymentDataset.data.push(payments);

      date = date.add(1, 'day');
    }

    datasets.push(invoicedDataset, soldDataset, separatedDataset, loanDataset, paymentDataset);

    return datasets;
  };

  const fetchData = async () => {
    const labels = getLabels();
    let datasets: ChartDataset<'bar'>[] = getDatasets([]);
    const weekAgo = dayjs().subtract(1, 'week').startOf('day');

    try {
      const res = await axios.get<{ history: ISaleHistory[] }>('/sale-history', {
        cancelToken: source?.token,
        params: {
          from: weekAgo.toDate(),
        },
      });

      datasets = getDatasets(res.data.history);
      setHistory(res.data.history.reverse());
    } catch (error) {
      toast.error('Hubo un error y no se pudo cargar los datos de la grafica');
      console.log(error);
    }

    setChartData({ labels, datasets });
  };

  useEffect(() => {
    if (isAuth) {
      source = CancelToken.source();
      fetchData();
      return () => {
        source.cancel('Cancelado por desmonte del componente');
      };
    }
  }, [isAuth, invoices.length]);

  return (
    <>
      <div className="relative mb-4 h-96 w-full 3xl:h-[60vh]">
        <Bar options={barOptions} data={chartData} />
      </div>

      <ScrollArea className="relative mb-2 h-96 overflow-y-auto bg-dark">
        <Table>
          <thead>
            <tr>
              <th scope="col">
                <div className="text-center">Fecha</div>
              </th>
              <th scope="col">Descripción</th>
              <th scope="col">
                <div className="text-center">Importe</div>
              </th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map(record => (
              <tr key={record.id}>
                <td className="text-center">
                  <span className="text-xs">
                    {dayjs(record.operationDate).isToday() || dayjs(record.operationDate).isYesterday()
                      ? dayjs(record.operationDate).fromNow()
                      : dayjs(record.operationDate).format('ddd DD MMM hh:mm a')}
                  </span>
                </td>
                <td>
                  <p>{record.description || 'No tiene descripción'}</p>
                  <div className="text-xs font-bold italic">
                    {record.operationType === 'sale' ? <p className="text-green-500">Venta</p> : null}
                    {record.operationType === 'credit' ? <p className="text-red-500">Credito</p> : null}
                    {record.operationType === 'separate' ? <p className="text-blue-500">Apartado</p> : null}
                    {record.operationType === 'credit_payment' ? (
                      <p className="text-emerald-500">Abono de credito</p>
                    ) : null}
                    {record.operationType === 'separate_payment' ? (
                      <p className="text-emerald-500">Abono de apartado</p>
                    ) : null}
                  </div>
                </td>
                <td className="text-right">{currencyFormat(record.amount)}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default WeeklyInvoiceChart;
