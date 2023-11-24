import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useConfigStore } from '@/store/config-store';
import { useAuthStore } from '@/store/auth-store';
import { addNewItemToList } from '@/logic/invoices-form';
import { useInvoicePageStore } from '@/store/invoices-page.store';
import { useCreateInvoice } from './react-query/invoices.hooks';
import type { IInvoiceStoreData, INewInvoiceItem } from '@/types';
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
  const user = useAuthStore(state => state.user);
  const store = useConfigStore(state => state.premiseStore);
  const isOpen = useInvoicePageStore(state => state.counterFormIsOpen);
  const hideForm = useInvoicePageStore(state => state.hideCounterForm);
  const showPrinterModal = useInvoicePageStore(state => state.showPrinterModal);

  const { mutate: createNewInvoice, isPending, isSuccess, data, error } = useCreateInvoice();

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

  const closeForm = () => {
    if (isPending) return;

    hideForm();
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
    if (isPending || amount <= 0) return;

    const invoiceData = getData();
    createNewInvoice(invoiceData);
  };

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  useEffect(resetBox, [store]);

  useEffect(() => {
    if (!isSuccess) return;

    setItems([]);
    setCustomer(defaulCustomer);
    setRegisterWithOtherData(false);
    closeForm();

    if (data) showPrinterModal(data.id);
  }, [isSuccess]);

  return {
    isOpen,
    isLoading: isPending,
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
    closeForm,
  };
}
