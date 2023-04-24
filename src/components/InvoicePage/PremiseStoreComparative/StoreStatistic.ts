import { IPremiseStore } from 'src/features/Config/types';
import SaleStatistic from './SaleStatistic';
import { Dayjs } from 'dayjs';

export default class StoreStatistic extends SaleStatistic {
  public store: IPremiseStore;

  constructor(store: IPremiseStore, date: Dayjs) {
    super(date);
    this.store = store;
  }
}
