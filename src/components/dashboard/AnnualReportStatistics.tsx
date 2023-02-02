import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { ActionIcon, Button, Select, Skeleton, Tabs } from '@mantine/core';
import { IAnnualReport } from 'src/types';
import { IconChartInfographic, IconReload, IconTrash } from '@tabler/icons';
import { ChartPeriod, CHART_DATA_PERIODS, MONTHS } from 'src/utils';

import AnnualGeneralChart from './AnnualGeneralChart';
import AnnualGeneralAux from './AnnualGeneralAux';
import AnnualCategoryChart from './AnnualCategoryChart';
import CategoryChartComponent from './CategoryChartComponent';

interface Props {
  title: string;
  description?: string;
  type?: 'sale' | 'credit' | 'separate' | 'credit_payment' | 'separate_payment';
}

const BASE_URL = '/dashboard/annual-report';

const AnnualReportStatistics = ({ title, description, type }: Props) => {
  const [reports, setReports] = useState<IAnnualReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const [period, setPeriod] = useState<string | null>(ChartPeriod.monthly);
  const [monthSelected, setMonthSelected] = useState<string | null>(
    dayjs().month().toString()
  );

  const fetchReport = async (year?: number): Promise<IAnnualReport> => {
    const res = await axios.get<{ report: IAnnualReport }>(BASE_URL, {
      params: { year, operation: type },
    });
    return res.data.report;
  };

  const getInitialData = async () => {
    try {
      const otherReports: IAnnualReport[] = [];
      if (reports.length > 1) {
        otherReports.push(...reports.slice(1));
      }
      setLoading(true);
      const report = await fetchReport();
      setReports([report, ...otherReports]);

      if (otherReports.length === 0) {
        const lastYear = await fetchReport(dayjs().year() - 1);
        setReports(current => [...current, lastYear]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addAnnualReport = async () => {
    const lastReport = reports.at(-1);
    const year = lastReport ? lastReport.year - 1 : undefined;
    try {
      setLoadingReport(true);

      const report = await fetchReport(year);
      setReports(current => {
        const list = current.slice();
        list.push(report);
        return list;
      });
    } catch (error) {
      toast.error(`No se pudo cargar el reporte del año ${year}`);
    } finally {
      setLoadingReport(false);
    }
  };

  const removeAnnualReport = () => {
    if (reports.length > 1) {
      setReports(currentList => {
        const list = currentList.slice();
        list.pop();
        return list;
      });
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  return (
    <div className="min-h-[300px] bg-gray-200 bg-opacity-90 px-4 pt-6 pb-2 dark:bg-dark">
      <header className="mb-4">
        <h2 className="mb-1 text-center text-2xl font-bold text-dark dark:text-light">
          {title}
        </h2>
        {description ? (
          <p className="mb-2 text-center text-sm italic">{description}</p>
        ) : null}

        {/* CONTROLS */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6">
          {/* PERIOD */}
          <Select
            value={period}
            data={CHART_DATA_PERIODS}
            onChange={setPeriod}
            size="xs"
          />
          {/* MONTH */}
          <Select
            value={monthSelected}
            data={MONTHS.map((name, index) => ({
              value: index.toString(),
              label: name,
            }))}
            onChange={setMonthSelected}
            size="xs"
            disabled={period === ChartPeriod.annual}
          />
          {/* ADD YEAR */}
          <Button
            size="xs"
            onClick={addAnnualReport}
            loading={loadingReport}
            leftIcon={<IconChartInfographic size={16} />}
          >
            Agregar año
          </Button>
          {/* REMOVE YEAR */}
          <Button
            size="xs"
            onClick={removeAnnualReport}
            color="red"
            leftIcon={<IconTrash size={16} />}
          >
            Remover año
          </Button>
          <ActionIcon color="grape" onClick={getInitialData} loading={loading}>
            <IconReload size={18} />
          </ActionIcon>
        </div>
      </header>
      <Skeleton visible={loading}>
        <Tabs defaultValue="general" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="general" icon={<IconChartInfographic size={14} />}>
              General
            </Tabs.Tab>
            <Tabs.Tab
              value="categories"
              icon={<IconChartInfographic size={14} />}
            >
              Por categorías
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general" pt="sm">
            <div className="grid grid-cols-12 gap-4 gap-y-6">
              {/* MAIN CHART */}
              <div className="col-span-12 lg:col-span-8 3xl:col-span-9">
                <AnnualGeneralChart
                  annualReports={reports}
                  period={period}
                  monthSelected={monthSelected}
                />
              </div>
              {/* ANNUAL SALES AUX */}
              <div className="col-span-12 self-center lg:col-span-4 3xl:col-span-3">
                <AnnualGeneralAux
                  title="Comparativa Anual"
                  description="Compara las ventas totales de los años seleccionados"
                  annualReports={reports}
                  period={period}
                />
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="categories" pt="sm">
            <div className="grid grid-cols-12 gap-4 gap-y-6">
              {/* CATEGORY CHART */}
              <div className="col-span-12 lg:col-span-8 3xl:col-span-9">
                <CategoryChartComponent
                  annualReports={reports}
                  period={period}
                  monthSelected={monthSelected}
                />
              </div>

              <div className="col-span-12 self-center lg:col-span-4 3xl:col-span-3">
                <AnnualCategoryChart annualReports={reports} />
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Skeleton>
    </div>
  );
};

export default AnnualReportStatistics;
