import { Dayjs } from 'dayjs';
import SaleStatistic from './SaleStatistic';
import StoreStatistic from './StoreStatistic';
import { IPremiseStore } from 'src/features/Config/types';
import { IInvoiceBase } from 'src/types';

export default class DailyStatistic extends SaleStatistic {
  public id: string;

  public stores: StoreStatistic[];

  constructor(date: Dayjs, stores?: IPremiseStore[]) {
    super(date);
    this.id = date.format('DD-MM-YYYY');
    this.stores = [];

    if (stores) {
      stores.forEach(store => {
        this.stores.push(new StoreStatistic(store, date));
      });
    }
  }

  addInvoices(
    invoices: IInvoiceBase[],
    lastDaily?: DailyStatistic | undefined
  ): void {
    super.addInvoices(invoices, lastDaily);
    this.stores.forEach(store => {
      const storeInvoices = invoices.filter(
        inv => inv.premiseStore?.id === store.store.id
      );

      const lastStoreDaily = lastDaily?.stores.find(
        item => item.store.id === store.store.id
      );

      store.addInvoices(storeInvoices, lastStoreDaily);
    });
  }
}
