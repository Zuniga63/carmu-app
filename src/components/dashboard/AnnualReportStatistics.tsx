import React, { useState } from 'react';
import dayjs from 'dayjs';

import { ActionIcon, Button, Select, Tabs } from '@mantine/core';
import { IAnnualReport } from '@/types';
import { IconChartInfographic, IconReload, IconTrash } from '@tabler/icons-react';
import { ChartPeriod, CHART_DATA_PERIODS, MONTHS } from '@/utils';

import AnnualGeneralChart from './AnnualGeneralChart';
import AnnualGeneralAux from './AnnualGeneralAux';
import AnnualCategoryChart from './AnnualCategoryChart';
import CategoryChartComponent from './CategoryChartComponent';
import ProtectWrapper from '../ProtectWrapper';
import { useGetAnnualReports } from '@/hooks/react-query/dashboard.hooks';
import { useQueryClient } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';

export type ReportOperation = 'sale' | 'credit' | 'separate' | 'credit_payment' | 'separate_payment';

export type AnnualReportParams = {
  year?: number;
  operation?: ReportOperation;
};

interface Props {
  title: string;
  description?: string;
  type?: ReportOperation;
}

const AnnualReportStatistics = ({ title, description, type = 'sale' }: Props) => {
  const [reportParams, setReportParams] = useState<AnnualReportParams[]>([
    { year: dayjs().year(), operation: type },
    { year: dayjs().year() - 1, operation: type },
  ]);

  const [period, setPeriod] = useState<string | null>(ChartPeriod.monthly);
  const [monthSelected, setMonthSelected] = useState<string | null>(dayjs().month().toString());

  const result = useGetAnnualReports(reportParams);
  const queryClient = useQueryClient();

  const addAnnualReport = async () => {
    const lastReport = reportParams.at(-1);
    const currentYear = dayjs().year();

    if (!lastReport || !lastReport.year) {
      setReportParams([{ year: currentYear, operation: type }]);
      return;
    }

    const year = lastReport.year - 1;
    setReportParams([...reportParams, { year, operation: type }]);
  };

  const removeAnnualReport = () => {
    if (reportParams.length <= 1) return;
    const newList = reportParams.slice();
    newList.pop();
    setReportParams(newList);
  };

  const handleRefresh = () => {
    const currentYear = dayjs().year();
    queryClient.invalidateQueries([ServerStateKeysEnum.AnnualReports, { year: currentYear, operation: type }]);
  };

  return (
    <div className="min-h-[300px] bg-gray-200 bg-opacity-90 px-4 pb-2 pt-6 dark:bg-dark">
      <header className="mb-4">
        <h2 className="mb-1 text-center text-2xl font-bold text-dark dark:text-light">{title}</h2>
        {description ? <p className="mb-2 text-center text-sm italic">{description}</p> : null}
      </header>

      <ProtectWrapper>
        {/* CONTROLS */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {/* PERIOD */}
          <Select value={period} data={CHART_DATA_PERIODS} onChange={setPeriod} size="xs" />
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
            loading={result.isLoading}
            leftIcon={<IconChartInfographic size={16} />}
          >
            Agregar año
          </Button>
          {/* REMOVE YEAR */}
          <Button size="xs" onClick={removeAnnualReport} color="red" leftIcon={<IconTrash size={16} />}>
            Remover año
          </Button>
          <ActionIcon color="grape" onClick={handleRefresh} loading={result.isLoading}>
            <IconReload size={18} />
          </ActionIcon>
        </div>

        <Tabs defaultValue="general" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="general" icon={<IconChartInfographic size={14} />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="categories" icon={<IconChartInfographic size={14} />}>
              Por categorías
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general" pt="sm">
            <div className="grid grid-cols-12 gap-4 gap-y-6">
              {/* MAIN CHART */}
              <div className="col-span-12 lg:col-span-8 3xl:col-span-9">
                <AnnualGeneralChart
                  annualReports={result.reports as IAnnualReport[]}
                  period={period}
                  monthSelected={monthSelected}
                />
              </div>
              {/* ANNUAL SALES AUX */}
              <div className="col-span-12 self-center lg:col-span-4 3xl:col-span-3">
                <AnnualGeneralAux
                  title="Comparativa Anual"
                  description="Compara las ventas totales de los años seleccionados"
                  annualReports={result.reports as IAnnualReport[]}
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
                  annualReports={result.reports as IAnnualReport[]}
                  period={period}
                  monthSelected={monthSelected}
                />
              </div>

              <div className="col-span-12 self-center lg:col-span-4 3xl:col-span-3">
                <AnnualCategoryChart annualReports={result.reports as IAnnualReport[]} />
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </ProtectWrapper>
    </div>
  );
};

export default AnnualReportStatistics;
