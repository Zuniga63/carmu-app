import { CashReportResponse } from '@/types';
import axios from 'axios';

export async function getCashReports() {
  const res = await axios.get<CashReportResponse>('/dashboard/cash-report');
  return res.data.reports;
}
