import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { IInvoiceStoreData, INewInvoiceItem } from '@/types';

import { hideCounterSaleForm, invoicePageSelector, storeNewInvoice } from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useConfigStore } from '@/store/config-store';
import { useAuthStore } from '@/store/auth-store';

import { addNewItemToList } from '@/logic/invoices-form';
import { type IInvoiceCustomer } from '@/components/InvoicePage/InvoiceForm';

const defaulCustomer: IInvoiceCustomer = {
  id: null,
  name: '',
  document: '',
  documentType: 'CC',
  address: '',
  phone: '',
};

export function useCounterSaleForm() {
  const {
    counterSaleFormOpened: opened,
    storeLoading: loading,
    storeError: error,
    storeSuccess: success,
  } = useAppSelector(invoicePageSelector);
  const user = useAuthStore(state => state.user);
  const store = useConfigStore(state => state.premiseStore);
  const dispatch = useAppDispatch();

  const [items, setItems] = useState<INewInvoiceItem[]>([]);

  // Cashbox
  const [cashboxId, setCashboxId] = useState<string | null>(null);

  // CUSTOMER
  const [customer, setCustomer] = useState(defaulCustomer);
  const [registerWithOtherData, setRegisterWithOtherData] = useState(false);

  const amount = useMemo(() => {
    return items.reduce((sum, { amount }) => sum + amount, 0);
  }, [items]);

  // ------------------------------------------------------------------------------------------------------------------
  // METHOD
  // ------------------------------------------------------------------------------------------------------------------
  const resetBox = () => {
    if (store) {
      const { defaultBox } = store;
      const id = defaultBox && defaultBox.openBox && dayjs().isAfter(defaultBox.openBox) ? defaultBox.id : null;

      setCashboxId(id);
    } else {
      setCashboxId(null);
    }
  };

  const close = () => {
    if (loading) return;

    dispatch(hideCounterSaleForm());
    resetBox();
  };

  const addNewItem = (newItem: INewInvoiceItem) => {
    const newList = addNewItemToList({ items, newItem });
    setItems(newList);
  };

  const removeItem = (itemId: string) => {
    const list = items.filter(item => item.id !== itemId);
    setItems(list);
  };

  const getData = (): IInvoiceStoreData => {
    return {
      sellerId: user?.id,
      premiseStoreId: store ? store.id : undefined,
      isSeparate: false,
      sellerName: user?.name,
      customerId: customer.id || undefined,
      customerName: customer.name || undefined,
      customerAddress: customer.address.trim() || undefined,
      customerDocument: customer.document || undefined,
      customerDocumentType: customer.documentType || undefined,
      customerPhone: customer.phone || undefined,
      expeditionDate: dayjs().toDate(),
      expirationDate: dayjs().add(1, 'month').toDate(),
      cash: amount,
      items: items.map(item => ({ ...item, id: undefined, amount: undefined })),
      cashPayments: [
        {
          cashboxId: cashboxId || undefined,
          description: 'Pago en efectivo',
          amount: amount,
          register: true,
        },
      ],
      registerWithOtherCustomerData: registerWithOtherData,
    };
  };

  const checkIn = () => {
    if (loading || amount <= 0) return;

    const invoiceData = getData();
    dispatch(storeNewInvoice(invoiceData));
  };

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  useEffect(resetBox, [store]);

  useEffect(() => {
    if (success) {
      setItems([]);
      setCustomer(defaulCustomer);
      setRegisterWithOtherData(false);
      close();
    }
  }, [success]);

  return {
    isOpen: opened,
    isLoading: loading,
    items,
    isEnabled: amount > 0,
    registerWithOtherData,
    customer: {
      data: customer,
      registerWithOtherData,
      update: setCustomer,
      udpateOtherData: setRegisterWithOtherData,
    },
    cashbox: {
      id: cashboxId,
      update: setCashboxId,
    },
    addNewItem,
    removeItem,
    checkIn,
    closeForm: close,
  };
}
