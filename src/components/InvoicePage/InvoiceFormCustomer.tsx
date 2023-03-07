import { Checkbox, Select, TextInput } from '@mantine/core';
import { IconHome, IconPhone, IconSearch } from '@tabler/icons';
import React, { forwardRef, useEffect } from 'react';
import { customerPageSelector } from 'src/features/CustomerPage';
import { useAppSelector } from 'src/store/hooks';
import { currencyFormat, normalizeText } from 'src/utils';
import { IInvoiceCustomer } from './InvoiceForm';
import InvoiceFormGroup from './InvoiceFormGroup';

interface Props {
  customer: IInvoiceCustomer;
  onCustomerChange: React.Dispatch<React.SetStateAction<IInvoiceCustomer>>;
  registerWithOtherData: boolean;
  setRegisterWithOtherData: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

interface ICustomerSelectProps {
  label: string;
  search: string;
  balance?: number;
}

const SelectItemCustomer = forwardRef<HTMLDivElement, ICustomerSelectProps>(
  ({ label, search, balance, ...others }: ICustomerSelectProps, ref) => (
    <div ref={ref} {...others}>
      <h2 className="font-bold">{label}</h2>
      {balance ? (
        <p className="text-xs italic">
          Saldo: <span className="font-bold">{currencyFormat(balance)}</span>
        </p>
      ) : null}
    </div>
  )
);

SelectItemCustomer.displayName = 'SelectItemCustomer';

const InvoiceFormCustomer = ({
  customer,
  onCustomerChange,
  registerWithOtherData,
  setRegisterWithOtherData,
  className,
}: Props) => {
  const { customers } = useAppSelector(customerPageSelector);

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
          itemComponent={SelectItemCustomer}
          data={customers.map(customer => ({
            value: customer.id,
            label: `${customer.fullName}`.trim(),
            balance: customer.balance,
            search: normalizeText(
              `${customer.fullName} ${customer.documentNumber || ''}`.trim()
            ),
          }))}
          filter={(value, item) => item.search.includes(normalizeText(value))}
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
        {/* PHONE */}
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

        <div className="lg:col-span-2">
          <Checkbox
            label="Registrar con estos datos"
            checked={registerWithOtherData}
            onChange={({ currentTarget }) => {
              setRegisterWithOtherData(currentTarget.checked);
            }}
          />
        </div>
      </div>
    </InvoiceFormGroup>
  );
};

export default InvoiceFormCustomer;
