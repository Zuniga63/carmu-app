import { AnnualReportParams } from '@/components/dashboard/AnnualReportStatistics';
import { CashReportResponse, IAnnualReport, ICreditEvolutionReport, ISaleHistory } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';

export async function getCashReports() {
  const res = await axios.get<CashReportResponse>('/dashboard/cash-report');
  return res.data.reports;
}

export async function getCreditEvolution() {
  const res = await axios.get<ICreditEvolutionReport>('/dashboard/credit-evolution');
  return res.data;
}

export async function getAnnualReportStatistics({ year, operation }: AnnualReportParams) {
  const res = await axios.get<{ report: IAnnualReport }>('/dashboard/annual-report', {
    params: { year, operation },
  });

  return res.data.report;
}

export async function getWeeklyInvoiceHistory() {
  const from = dayjs().subtract(1, 'week').startOf('day').toDate();

  const res = await axios.get<{ history: ISaleHistory[] }>('/sale-history', { params: { from } });
  return res.data.history.reverse();
}
