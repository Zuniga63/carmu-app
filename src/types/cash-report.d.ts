export type CashReport = {
  month: string;
  year: number;
  incomes: number;
  averageIncomes: number;
  annualAverageIncomes: number;
  sumIncomes: number;
  expenses: number;
  averageExpenses: number;
  annualAverageExpenses: number;
  sumExpenses: number;
  balance: number;
  globalBalance: number;
};

export type CashReportResponse = {
  reports: CashReport[];
};
