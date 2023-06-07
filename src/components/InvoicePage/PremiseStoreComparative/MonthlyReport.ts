import DailyReport, { ReportInvoice } from './DailyReport';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(dayOfYear);

export default class MonthlyReport {
  public name: string;

  public amount: number;

  public annualAmount: number;

  public invoices: ReportInvoice[];

  public dailyReports: DailyReport[];

  public dailyAverage: number;

  public annualDailyAverage: number;

  public dailyAverageGrowth?: number;

  public annualDailyAverageGrowth?: number;

  constructor(
    date: Dayjs,
    invoices: ReportInvoice[],
    lastReport?: MonthlyReport,
    lastMonth = false
  ) {
    const today = dayjs();
    const days = lastMonth ? today.date() : date.daysInMonth();
    const dayOfYear = lastMonth
      ? today.dayOfYear()
      : date.endOf('month').dayOfYear();

    this.name = date.format('MMMM');
    this.amount = invoices.reduce((sum, { amount }) => sum + amount, 0);
    this.annualAmount = this.amount;
    this.invoices = invoices;
    this.dailyReports = this.createDailyReports(date, invoices, lastReport);
    this.dailyAverage = this.amount / days;
    this.annualDailyAverage = this.dailyAverage;

    if (lastReport) {
      const {
        dailyAverage: lastDailyAverage,
        annualAmount: lastAnnualAmount,
        annualDailyAverage: lastAnnualDailyAverage,
      } = lastReport;

      this.annualAmount += lastAnnualAmount;
      this.annualDailyAverage = this.annualAmount / dayOfYear;

      if (lastAnnualDailyAverage > 0 && lastAnnualDailyAverage > 0) {
        this.dailyAverageGrowth =
          (this.dailyAverage - lastDailyAverage) / lastDailyAverage;

        this.annualDailyAverageGrowth =
          (this.annualDailyAverage - lastAnnualDailyAverage) /
          lastAnnualDailyAverage;
      }
    }
  }

  protected createDailyReports(
    date: Dayjs,
    invoices: ReportInvoice[],
    lastReport?: MonthlyReport
  ) {
    const reports: DailyReport[] = [];
    const endMonthDate = date.endOf('month');
    let dailyDate = date.clone();
    let lastDailyReport = lastReport?.dailyReports.at(-1);

    while (dailyDate.isBefore(endMonthDate)) {
      const startDay = dailyDate.startOf('days');
      const endDay = dailyDate.endOf('day');

      const dailyInvoices = invoices.filter(({ date: invoiceDate }) =>
        dayjs(invoiceDate).isBetween(startDay, endDay, 'milliseconds', '[]')
      );

      const dailyReport = new DailyReport(
        dailyDate,
        dailyInvoices,
        lastDailyReport
      );

      reports.push(dailyReport);
      lastDailyReport = dailyReport;

      if (dailyDate.isToday()) {
        break;
      }

      dailyDate = dailyDate.add(1, 'day');
    }

    return reports;
  }

  protected calculatePercentage(fraction: number, decimals = 0) {
    const roundedNumber = Math.round(fraction * Math.pow(10, 2 + decimals));
    return roundedNumber / Math.pow(10, decimals);
  }

  protected round(value: number, decimals: number) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  public getDailyAverage(decimals = 0) {
    return this.round(this.dailyAverage, decimals);
  }

  public getDailyAverageGrowth(decimals = 1) {
    return this.calculatePercentage(this.dailyAverageGrowth || 0, decimals);
  }

  public getAnnualDailyAverage(decimals = 0) {
    return this.round(this.annualDailyAverage, decimals);
  }

  public getAnnualDailyAverageGrowth(decimals = 1) {
    return this.calculatePercentage(
      this.annualDailyAverageGrowth || 0,
      decimals
    );
  }
}
