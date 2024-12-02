import type { ApiPremiseStore } from '../interfaces';
import type { PremiseStore, PremiseStoreCashbox } from '../../interfaces';

export function createPremiseStore(apiPremiseStore: ApiPremiseStore): PremiseStore {
  const defaultBox: PremiseStoreCashbox | undefined = apiPremiseStore.defaultBox
    ? {
        id: apiPremiseStore.defaultBox._id,
        name: apiPremiseStore.defaultBox.name,
        openBox: apiPremiseStore.defaultBox.openBox,
      }
    : undefined;

  return {
    id: apiPremiseStore.id,
    name: apiPremiseStore.name,
    phone: apiPremiseStore.phone,
    address: apiPremiseStore.address,
    defaultBox,
    invoices: apiPremiseStore.invoices?.length ?? 0,
    monthlySales: apiPremiseStore.monthlySales ?? 0,
    weeklySales: apiPremiseStore.weeklySales ?? 0,
  };
}
