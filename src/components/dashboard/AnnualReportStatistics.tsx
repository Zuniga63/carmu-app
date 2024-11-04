import dayjs from 'dayjs';
import { useState } from 'react';
import { IconLoader2, IconReload } from '@tabler/icons-react';

import { Button } from '../ui/Button';
import { IAnnualReport } from '@/types';
import ProtectWrapper from '../ProtectWrapper';
import AnnualGeneralAux from './AnnualGeneralAux';
import AnnualGeneralChart from './AnnualGeneralChart';
import { useQueryClient } from '@tanstack/react-query';
import AnnualCategoryChart from './AnnualCategoryChart';
import CategoryChartComponent from './CategoryChartComponent';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { ChartPeriod, CHART_DATA_PERIODS, MONTHS } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useGetAnnualReports } from '@/hooks/react-query/dashboard.hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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

  const [period, setPeriod] = useState<string | undefined>(ChartPeriod.monthly);
  const [monthSelected, setMonthSelected] = useState<string | undefined>(dayjs().month().toString());

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
    queryClient.invalidateQueries({
      queryKey: [ServerStateKeysEnum.AnnualReports, { year: currentYear, operation: type }],
    });
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
          <Select onValueChange={setPeriod} value={period}>
            <SelectTrigger className="w-auto min-w-max">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              {CHART_DATA_PERIODS.map(({ value, label }, index) => (
                <SelectItem key={index} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* MONTH */}
          <Select onValueChange={setMonthSelected} value={monthSelected}>
            <SelectTrigger className="w-auto min-w-max">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((name, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* ADD YEAR */}
          <Button onClick={addAnnualReport} variant={'default'}>
            Agregar año
          </Button>
          {/* REMOVE YEAR */}
          <Button onClick={removeAnnualReport} variant={'destructive'}>
            Remover año
          </Button>
          {/* REFRESH */}
          <Button size={'icon'} variant={'outline'} onClick={handleRefresh}>
            {result.isLoading ? <IconLoader2 className="animate-spin" size={18} /> : <IconReload size={18} />}
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="categories">Por categorías</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
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
          </TabsContent>

          <TabsContent value="categories">
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
          </TabsContent>
        </Tabs>
      </ProtectWrapper>
    </div>
  );
};

export default AnnualReportStatistics;
