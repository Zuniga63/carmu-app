import { Dayjs } from 'dayjs';
import { IInvoiceBase } from 'src/types';
import Statistic from './Statistic';

export default class SaleStatistic {
  public date: Dayjs;

  public invoices: IInvoiceBase[];

  public invoiceStatistic: Statistic;

  public invoiced: Statistic;

  public cash: Statistic;

  public credit: Statistic;

  public separate: Statistic;

  constructor(date: Dayjs) {
    this.date = date;
    this.invoices = [];
    this.invoiceStatistic = new Statistic();
    this.invoiced = new Statistic();
    this.cash = new Statistic();
    this.credit = new Statistic();
    this.separate = new Statistic();
  }

  protected updateInvoiceStatistics(lastDaily?: SaleStatistic) {
    const dayOfMonth = this.date.date();
    const invoiceCount = this.invoices.length;
    let accumulated = invoiceCount;
    let average = accumulated / dayOfMonth;
    let growRate = 0;
    let averageGrowthRate = 0;

    if (lastDaily) {
      const { accumulated: lastAccumulated, average: lastAverage } =
        lastDaily.invoiceStatistic;

      accumulated += lastAccumulated;
      average = accumulated / dayOfMonth;
      growRate =
        lastAverage > 0 ? (invoiceCount - lastAverage) / lastAverage : Infinity;
      averageGrowthRate = (average - lastAverage) / lastAverage;
    }

    this.invoiceStatistic.amount = invoiceCount;
    this.invoiceStatistic.accumulated = accumulated;
    this.invoiceStatistic.average = average;
    this.invoiceStatistic.growthRate = growRate;
    this.invoiceStatistic.averageGrowthRate = averageGrowthRate;
  }

  protected updateInvoicedStatistics(lastDaily?: SaleStatistic) {
    const dayOfMonth = this.date.date();
    const amount = this.invoices.reduce(
      (current, last) => current + last.amount,
      0
    );

    const accumulated = amount + (lastDaily?.invoiced.accumulated || 0);

    const average = accumulated / dayOfMonth;
    let growthRate = 0;
    let averageGrowthRate = 0;

    if (lastDaily) {
      const { invoiced } = lastDaily;
      growthRate =
        invoiced.average > 0
          ? (amount - invoiced.average) / invoiced.average
          : 0;
      averageGrowthRate = (average - invoiced.average) / invoiced.average;
    }

    this.invoiced.amount = amount;
    this.invoiced.accumulated = accumulated;
    this.invoiced.average = average;
    this.invoiced.growthRate = growthRate;
    this.invoiced.averageGrowthRate = averageGrowthRate;
  }

  protected updateCashStatistics(lastDaily?: SaleStatistic) {
    const dayOfMonth = this.date.date();

    const amount = this.invoices.reduce(
      (sum, invoice) =>
        sum +
        (invoice.cash && invoice.cash > invoice.amount
          ? invoice.amount
          : invoice.cash || 0),
      0
    );

    const accumulated = amount + (lastDaily?.cash.accumulated || 0);
    const average = accumulated / dayOfMonth;
    let growthRate = 0;
    let averageGrowthRate = 0;

    if (lastDaily) {
      const { cash } = lastDaily;
      growthRate =
        cash.average > 0 ? (amount - cash.average) / cash.average : 0;
      averageGrowthRate = (average - cash.average) / cash.average;
    }

    this.cash.amount = amount;
    this.cash.accumulated = accumulated;
    this.cash.average = average;
    this.cash.growthRate = growthRate;
    this.cash.averageGrowthRate = averageGrowthRate;
  }

  protected updateCreditStatistics(lastDaily?: SaleStatistic) {
    const dayOfMonth = this.date.date();

    const amount = this.invoices.reduce(
      (sum, invoice) =>
        sum + (!invoice.isSeparate && invoice.credit ? invoice.credit : 0),
      0
    );
    const accumulated = amount + (lastDaily?.credit.accumulated || 0);
    const average = accumulated / dayOfMonth;
    let growthRate = 0;
    let averageGrowthRate = 0;

    if (lastDaily) {
      const { credit } = lastDaily;
      growthRate =
        credit.average > 0 ? (amount - credit.average) / credit.average : 0;
      averageGrowthRate = (average - credit.average) / credit.average;
    }

    this.credit.amount = amount;
    this.credit.accumulated = accumulated;
    this.credit.average = average;
    this.credit.growthRate = growthRate;
    this.credit.averageGrowthRate = averageGrowthRate;
  }

  protected updateSeparatedStatistics(lastDaily?: SaleStatistic) {
    const dayOfMonth = this.date.date();

    const amount = this.invoices.reduce(
      (sum, invoice) =>
        sum + (invoice.isSeparate && invoice.credit ? invoice.credit : 0),
      0
    );
    const accumulated = amount + (lastDaily?.separate.accumulated || 0);
    const average = accumulated / dayOfMonth;
    let growthRate = 0;
    let averageGrowthRate = 0;

    if (lastDaily) {
      const { separate } = lastDaily;
      growthRate =
        separate.average > 0
          ? (amount - separate.average) / separate.average
          : 0;
      averageGrowthRate = (average - separate.average) / separate.average;
    }

    this.separate.amount = amount;
    this.separate.accumulated = accumulated;
    this.separate.average = average;
    this.separate.growthRate = growthRate;
    this.separate.averageGrowthRate = averageGrowthRate;
  }

  addInvoices(invoices: IInvoiceBase[], lastDaily?: SaleStatistic) {
    this.invoices = invoices;

    this.updateInvoiceStatistics(lastDaily);
    this.updateInvoicedStatistics(lastDaily);
    this.updateCashStatistics(lastDaily);
    this.updateCreditStatistics(lastDaily);
    this.updateSeparatedStatistics(lastDaily);
  }
}
