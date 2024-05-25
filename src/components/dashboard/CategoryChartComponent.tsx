import dayjs from 'dayjs';

import { IAnnualReport } from '@/types';
import CategoryChart from './CategoryChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

interface Props {
  annualReports: IAnnualReport[];
  period?: string;
  monthSelected?: string;
}

const CategoryChartComponent = ({ annualReports, period, monthSelected }: Props) => {
  return (
    <Tabs defaultValue={String(dayjs().year())}>
      <TabsList>
        {annualReports.map(annualReport => (
          <TabsTrigger value={String(annualReport.year)} key={annualReport.year}>
            {annualReport.year}
          </TabsTrigger>
        ))}
      </TabsList>

      {annualReports.map(annualReport => (
        <TabsContent value={String(annualReport.year)} key={annualReport.year}>
          <CategoryChart annualReport={annualReport} period={period} month={monthSelected} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoryChartComponent;
