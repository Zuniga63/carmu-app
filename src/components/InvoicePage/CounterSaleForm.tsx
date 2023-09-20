import { useCounterSaleForm } from '@/hooks/use-counter-sale-form';

import { Button, Group, Tabs } from '@mantine/core';
import { IconDeviceFloppy, IconUsers } from '@tabler/icons-react';

import InvoiceFormCustomer from './InvoiceFormCustomer';
import CounterSaleBoxSelect from './CounterSaleBoxSelect';
import CounterSaleItemForm from './CounterSaleItemForm';
import CounterSaleItemList from './CounterSaleItemList';
import InvoiceFormModal from './InvoiceFormModal';

const CounterSaleForm = () => {
  const { isOpen, isLoading, items, isEnabled, cashbox, customer, addNewItem, removeItem, checkIn, closeForm } =
    useCounterSaleForm();

  return (
    <InvoiceFormModal isOpen={isOpen} onClose={closeForm} size="xl">
      <div className="mx-auto mb-8 flex w-11/12 flex-col">
        <CounterSaleBoxSelect value={cashbox.id} onChange={cashbox.update} />

        <Tabs defaultValue="items" className="mb-8">
          <Tabs.List>
            <Tabs.Tab value="items">Items</Tabs.Tab>
            <Tabs.Tab value="customer" icon={<IconUsers size={14} />}>
              Cliente
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="items" pt="xs">
            <CounterSaleItemForm onAddItem={addNewItem} />
          </Tabs.Panel>

          <Tabs.Panel value="customer" pt="xl">
            <InvoiceFormCustomer
              className="lg:col-span-9"
              customer={customer.data}
              onCustomerChange={customer.update}
              registerWithOtherData={customer.registerWithOtherData}
              setRegisterWithOtherData={customer.udpateOtherData}
            />
          </Tabs.Panel>
        </Tabs>

        {/* ITEMS */}
        <CounterSaleItemList items={items} onRemoveItem={removeItem} />

        <Group position="center" mt="xl">
          <Button
            onClick={checkIn}
            leftIcon={<IconDeviceFloppy size={24} stroke={2.5} />}
            loading={isLoading}
            disabled={!isEnabled}
          >
            Registrar Venta
          </Button>
        </Group>
      </div>
    </InvoiceFormModal>
  );
};

export default CounterSaleForm;
