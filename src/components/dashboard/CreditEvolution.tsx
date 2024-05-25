import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import { Skeleton } from '../ui/skeleton';
import ProtectWrapper from '../ProtectWrapper';
import CreditEvolutionChart from './CreditEvolutionChart';
import CreditEvolutionChartAux from './CreditEvolutionChartAux';
import { ChartPeriod, CHART_DATA_PERIODS, MONTHS } from '@/lib/utils';
import { useGetCreditEvolution } from '@/hooks/react-query/dashboard.hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const CreditEvolution = () => {
  const [period, setPeriod] = useState<string | undefined>(ChartPeriod.monthly);
  const [monthSelected, setMonthSelected] = useState<string | undefined>(dayjs().month().toString());

  const { data, isLoading, isError, error } = useGetCreditEvolution();

  useEffect(() => {
    if (!isError) return;
    console.log(error);
    toast.error('Hubo un erro en la consulta, intentalo mas tarde.');
  }, [isError]);

  return (
    <ProtectWrapper>
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-neutral-800">
          <Skeleton className="absolute inset-0 z-10 rounded-none" />
        </div>
      )}

      <div className="min-h-[300px] bg-gray-200 bg-opacity-90 px-4 pb-2 pt-6 dark:bg-dark">
        <header className="mb-4">
          <h2 className="mb-1 text-center text-2xl font-bold text-dark dark:text-light">
            Evolución de Credito {dayjs().year()}
          </h2>
          <p className="mb-2 text-center text-sm italic">Resume como se ha comportado la cartera a lo largo del año</p>

          {/* CONTROLS */}
        </header>

        <div className="mb-4 flex justify-center gap-x-6">
          {/* PERIOD */}
          <Select onValueChange={setPeriod} value={period}>
            <SelectTrigger className="w-60">
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

          <Select onValueChange={setMonthSelected} value={monthSelected}>
            <SelectTrigger className="w-60">
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
        </div>

        {data ? (
          <div className="grid grid-cols-12 gap-4 gap-y-6">
            <div className="col-span-12 lg:col-span-8 3xl:col-span-9">
              <CreditEvolutionChart creditReport={data} period={period} monthSelected={monthSelected} />
            </div>
            <div className="col-span-12 self-center lg:col-span-4 3xl:col-span-3">
              <CreditEvolutionChartAux creditReport={data} period={period} monthSelected={monthSelected} />
            </div>
          </div>
        ) : null}
      </div>
    </ProtectWrapper>
  );
};

export default CreditEvolution;
