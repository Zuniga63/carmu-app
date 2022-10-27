import React, { useState } from 'react';
import { Select, Tabs } from '@mantine/core';
import { IconChartInfographic } from '@tabler/icons';
import dayjs from 'dayjs';
import { IAnnualReport } from 'types';
import CategoryChart from './CategoryChart';
import { ChartPeriod, CHART_DATA_PERIODS, MONTHS } from 'utils';

interface Props {
  title: string;
  description?: string;
  annualReports: IAnnualReport[];
}

const CategoryChartComponent = ({ title, description, annualReports }: Props) => {
  const [period, setPeriod] = useState<string | null>(ChartPeriod.annual);
  const [monthSelected, setMonthSelected] = useState<string | null>(dayjs().month().toString());

  return (
    <div>
      <header className="mb-2">
        <h2 className="text-center font-bold uppercase">{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      <div>
        <div className="mb-4 flex justify-evenly">
          <Select value={period} data={CHART_DATA_PERIODS} onChange={setPeriod} size="xs" />
          <Select
            value={monthSelected}
            data={MONTHS.map((name, index) => ({ value: index.toString(), label: name }))}
            onChange={setMonthSelected}
            size="xs"
            disabled={period === ChartPeriod.annual}
          />
        </div>
        <Tabs defaultValue={String(dayjs().year())}>
          <Tabs.List>
            {annualReports.map(annualReport => (
              <Tabs.Tab
                value={String(annualReport.year)}
                key={annualReport.year}
                icon={<IconChartInfographic size={14} />}
              >
                {annualReport.year}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {annualReports.map(annualReport => (
            <Tabs.Panel value={String(annualReport.year)} key={annualReport.year} pt="xs">
              <CategoryChart annualReport={annualReport} period={period} month={monthSelected} />
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryChartComponent;
