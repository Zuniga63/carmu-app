import { Select, TextInput } from '@mantine/core';
import { IconHome, IconPhone, IconSearch } from '@tabler/icons';
import React, { useEffect } from 'react';
import { invoicePageSelector } from 'src/features/InvoicePage';
import { useAppSelector } from 'src/store/hooks';
import { IInvoiceCustomer } from './InvoiceForm';
import InvoiceFormGroup from './InvoiceFormGroup';

interface Props {
  customer: IInvoiceCustomer;
  onCustomerChange: React.Dispatch<React.SetStateAction<IInvoiceCustomer>>;
  className?: string;
}

const InvoiceFormCustomer = ({
  customer,
  onCustomerChange,
  className,
}: Props) => {
  const { customers } = useAppSelector(invoicePageSelector);

  useEffect(() => {
    const customerData = customers.find(c => c.id === customer.id);
    if (customerData) {
      onCustomerChange(current => ({
        id: customerData.id,
        name: customerData.fullName,
        document: customerData.documentNumber || current.document,
        documentType: customerData.documentType || current.documentType,
        phone: customerData.contacts.length
          ? customerData.contacts[0].phone
          : current.phone,
        address: customerData.address || current.address,
      }));
    }
  }, [customer.id]);

  return (
    <InvoiceFormGroup title="Cliente" className={className}>
      <div className="grid gap-2 lg:grid-cols-2">
        {/* SELECT CUSTOMER */}
        <Select
          className="lg:col-span-2"
          value={customer.id}
          data={customers.map(customer => ({
            value: customer.id,
            label: customer.fullName,
          }))}
          onChange={value =>
            onCustomerChange(current => ({ ...current, id: value }))
          }
          size="xs"
          placeholder="Buscar cliente"
          icon={<IconSearch size={15} />}
          searchable
          clearable
        />

        {/* Full Name */}
        <TextInput
          label="Nombre completo"
          value={customer.name}
          placeholder="Nombre completo del cliente"
          size="xs"
          onChange={({ target }) =>
            onCustomerChange(current => ({ ...current, name: target.value }))
          }
        />

        {/* Document */}
        <div className="grid grid-cols-12 gap-2">
          <TextInput
            label="Documento"
            className="col-span-9"
            value={customer.document}
            placeholder="Escribelo aquí"
            size="xs"
            onChange={({ target }) =>
              onCustomerChange(current => ({
                ...current,
                document: target.value,
              }))
            }
          />
          <Select
            className="col-span-3"
            label="Tipo"
            value={customer.documentType}
            onChange={value =>
              onCustomerChange(current => ({
                ...current,
                documentType: value || 'CC',
              }))
            }
            data={['CC', 'TI', 'NIT', 'PAP']}
            size="xs"
            allowDeselect={false}
          />
        </div>

        {/* ADDRESS */}
        <TextInput
          placeholder="Dirección del cliente"
          size="xs"
          icon={<IconHome size={15} />}
          value={customer.address}
          onChange={({ target }) =>
            onCustomerChange(current => ({ ...current, address: target.value }))
          }
        />
        <TextInput
          placeholder="Telefono de contacto"
          size="xs"
          icon={<IconPhone size={15} />}
          value={customer.phone}
          onChange={({ target }) =>
            onCustomerChange(current => ({ ...current, phone: target.value }))
          }
          type="tel"
        />
      </div>
    </InvoiceFormGroup>
  );
};

export default InvoiceFormCustomer;
