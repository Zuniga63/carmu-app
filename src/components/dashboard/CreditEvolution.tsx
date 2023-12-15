import React, { useEffect, useState } from 'react';
import { Select, Skeleton } from '@mantine/core';
import dayjs from 'dayjs';
import { ChartPeriod, CHART_DATA_PERIODS, MONTHS } from '@/lib/utils';
import { toast } from 'react-toastify';
import CreditEvolutionChart from './CreditEvolutionChart';
import CreditEvolutionChartAux from './CreditEvolutionChartAux';
import ProtectWrapper from '../ProtectWrapper';
import { useGetCreditEvolution } from '@/hooks/react-query/dashboard.hooks';

const CreditEvolution = () => {
  const [period, setPeriod] = useState<string | null>(ChartPeriod.monthly);
  const [monthSelected, setMonthSelected] = useState<string | null>(dayjs().month().toString());

  const { data, isLoading, isError, error } = useGetCreditEvolution();

  useEffect(() => {
    if (!isError) return;
    console.log(error);
    toast.error('Hubo un erro en la consulta, intentalo mas tarde.');
  }, [isError]);

  return (
    <ProtectWrapper>
      <Skeleton visible={isLoading}>
        <div className="min-h-[300px] bg-gray-200 bg-opacity-90 px-4 pb-2 pt-6 dark:bg-dark">
          <header className="mb-4">
            <h2 className="mb-1 text-center text-2xl font-bold text-dark dark:text-light">
              Evolución de Credito {dayjs().year()}
            </h2>
            <p className="mb-2 text-center text-sm italic">
              Resume como se ha comportado la cartera a lo largo del año
            </p>

            {/* CONTROLS */}
          </header>

          <div className="mb-4 flex justify-center gap-x-6">
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
      </Skeleton>
    </ProtectWrapper>
  );
};

export default CreditEvolution;
