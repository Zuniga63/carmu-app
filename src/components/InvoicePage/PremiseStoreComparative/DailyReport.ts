import dayjs, { Dayjs } from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);

export type ReportInvoice = {
  id: string;
  date: string;
  amount: number;
};

export default class DailyReport {
  public date: Dayjs;

  public amount: number;

  public monthlyAmount: number;

  public annualAmount: number;

  public invoices: ReportInvoice[];

  public dayOfMonth: number;

  public dayOfYear: number;

  public monthlyDailyAverage: number;

  public annualDailyAverage: number;

  public monthlyDailyAverageGrowth?: number;

  public annualDailyAverageGrowth?: number;

  constructor(
    date: Dayjs,
    invoices: ReportInvoice[],
    lastReport?: DailyReport
  ) {
    this.date = date;
    this.invoices = invoices;
    this.dayOfMonth = date.date();
    this.dayOfYear = date.dayOfYear();
    this.amount = invoices.reduce((sum, { amount }) => sum + amount, 0);
    this.monthlyAmount = this.amount;
    this.annualAmount = this.amount;
    this.monthlyDailyAverage = this.monthlyAmount / this.dayOfMonth;
    this.annualDailyAverage = this.annualAmount / this.dayOfYear;

    if (lastReport) {
      const { date, monthlyAmount, annualAmount } = lastReport;

      if (date.month() === this.date.month()) {
        this.monthlyAmount += monthlyAmount;
        this.monthlyDailyAverage = this.monthlyAmount / this.dayOfMonth;
        this.monthlyDailyAverageGrowth =
          (this.monthlyDailyAverage - lastReport.monthlyDailyAverage) /
          lastReport.monthlyDailyAverage;
      }

      this.annualAmount += annualAmount;
      this.annualDailyAverage = this.annualAmount / this.dayOfYear;
      this.annualDailyAverageGrowth =
        (this.annualDailyAverage - lastReport.annualDailyAverage) /
        lastReport.annualDailyAverage;
    }
  }

  protected calculatePercentage(fraction: number, decimals = 0) {
    const roundedNumber = Math.round(fraction * Math.pow(10, 2 + decimals));
    return roundedNumber / Math.pow(10, decimals);
  }

  protected round(value: number, decimals: number) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  public getMonthlyAverage(decimals = 0) {
    return this.round(this.monthlyDailyAverage, decimals);
  }

  public getMonthlyAverageGrowth(decimals = 1) {
    return this.calculatePercentage(
      this.monthlyDailyAverageGrowth || 0,
      decimals
    );
  }

  public getAnnualDailyAverage(decimals = 0) {
    return this.round(this.annualDailyAverage, decimals);
  }

  public getAnnualDailyAverageGrowth(decimals = 1) {
    return this.calculatePercentage(
      this.monthlyDailyAverageGrowth || 0,
      decimals
    );
  }
}
