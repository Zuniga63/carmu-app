export default class Statistic {
  public amount: number;

  public accumulated: number;

  public average: number;

  public growthRate: number;

  public averageGrowthRate: number;

  public amountPercentage: number;

  constructor() {
    this.amount = 0;
    this.average = 0;
    this.accumulated = 0;
    this.growthRate = 0;
    this.averageGrowthRate = 0;
    this.amountPercentage = 0;
  }

  protected transformFraction(fraction: number, decimals = 0) {
    const roundedNumber = Math.round(fraction * Math.pow(10, 2 + decimals));
    return roundedNumber / Math.pow(10, decimals);
  }

  public getGrowthRate(decimals = 0) {
    return this.transformFraction(this.growthRate, decimals);
  }

  public getAverageGrowthRate(decimals = 0) {
    return this.transformFraction(this.averageGrowthRate, decimals);
  }

  public getAverage(decimals = 1) {
    return (
      Math.round(this.average * Math.pow(10, decimals)) / Math.pow(10, decimals)
    );
  }
}
