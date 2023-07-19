import React from 'react';
import { Tabs } from '@mantine/core';
import { IconChartInfographic } from '@tabler/icons';
import dayjs from 'dayjs';
import { IAnnualReport } from 'src/types';
import CategoryChart from './CategoryChart';

interface Props {
  annualReports: IAnnualReport[];
  period: string | null;
  monthSelected: string | null;
}

const CategoryChartComponent = ({ annualReports, period, monthSelected }: Props) => {
  return (
    <Tabs defaultValue={String(dayjs().year())}>
      <Tabs.List>
        {annualReports.map(annualReport => (
          <Tabs.Tab value={String(annualReport.year)} key={annualReport.year} icon={<IconChartInfographic size={14} />}>
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
  );
};

export default CategoryChartComponent;
