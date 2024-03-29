import { Button, Drawer, SegmentedControl, Tabs, TextInput } from '@mantine/core';
import { IconAt, IconMapPin, IconPhone, IconUser } from '@tabler/icons-react';
import DrawerBody from '@/components/DrawerBody';
import DrawerHeader from '@/components/DrawerHeader';
import { FormEvent } from 'react';
import { useCustomerForm } from '@/hooks/customer-page/use-customer-form';

const CustomerForm = () => {
  const { form, isLargeScreen, customer, hideForm, updateForm } = useCustomerForm();

  const onCloseHandler = () => {
    if (form.isLoading) return;

    hideForm();
    form.reset();
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.isLoading) return;
    form.submit();
  };

  return (
    <Drawer
      opened={form.isOpen}
      onClose={onCloseHandler}
      padding={0}
      size={isLargeScreen ? 'lg' : '100%'}
      withCloseButton={false}
      position="right"
    >
      <DrawerHeader title={form.title} onClose={onCloseHandler} />
      <DrawerBody>
        <form onSubmit={onSubmitHandler}>
          <Tabs variant="pills" defaultValue="personal" className="mx-auto mb-4 w-11/12">
            <Tabs.List>
              <Tabs.Tab value="personal" icon={<IconUser size={14} />}>
                Datos Personales
              </Tabs.Tab>
              <Tabs.Tab value="contact" icon={<IconAt size={14} />}>
                Contacto
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="personal" pt="xs">
              {/* FIRST NAME */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Nombres</span>}
                className="mb-2"
                placeholder="Escribe el nombre aquí."
                id="customerName"
                required
                value={customer.firstName}
                onChange={({ target }) => updateForm('firstName', target.value)}
                disabled={form.isLoading}
                error={form.errors?.firstName?.message}
              />

              {/* LAST NAME */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Apellidos</span>}
                className="mb-2"
                placeholder="Escribe los apellidos aquí"
                id="customerLastName"
                value={customer.lastName}
                onChange={({ target }) => updateForm('lastName', target.value)}
                disabled={form.isLoading}
                error={form.errors?.lastName?.message}
              />

              {/* ALIAS */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Alias</span>}
                className="mb-2"
                placeholder="A.K.A"
                id="customerAlias"
                value={customer.alias}
                onChange={({ target }) => updateForm('alias', target.value)}
                disabled={form.isLoading}
                error={form.errors?.alias?.message}
              />

              {/* DOCUMENT */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Identificación</span>}
                className="mb-2"
                placeholder="#.###.###.###"
                id="customerDocument"
                value={customer.documentNumber}
                onChange={({ target }) => updateForm('documentNumber', target.value)}
                disabled={form.isLoading}
                error={form.errors?.documentNumber?.message}
              />

              {/* DOCUMENT TYPE */}
              <SegmentedControl
                value={customer.documentType}
                onChange={value => updateForm('documentType', value)}
                fullWidth
                disabled={form.isLoading}
                data={[
                  { label: 'CC', value: 'CC' },
                  { label: 'TI', value: 'TI' },
                  { label: 'NIT', value: 'NIT' },
                  { label: 'Pasaporte', value: 'PAP' },
                ]}
              />
            </Tabs.Panel>

            <Tabs.Panel value="contact" pt="xs">
              {/* EMAIL */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Email</span>}
                className="mb-2"
                placeholder="ejemplo@ejemplo.com"
                id="customerEmail"
                value={customer.email}
                onChange={({ target }) => updateForm('email', target.value)}
                type="email"
                icon={<IconAt size={20} />}
                disabled={form.isLoading}
                error={form.errors?.email?.message}
              />

              {/* PHONE */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Telefono</span>}
                className="mb-2"
                placeholder="555-5555"
                id="customerPhone"
                value={customer.phone}
                onChange={({ target }) => updateForm('phone', target.value)}
                type="tel"
                icon={<IconPhone size={20} />}
                disabled={form.isLoading}
                error={form.errors?.['contact.1.phone']?.message}
              />

              {/* ADDRESS */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Dirección</span>}
                className="mb-2"
                placeholder="Avenida siempre vida 1234"
                id="customerAddress"
                value={customer.address}
                onChange={({ target }) => updateForm('address', target.value)}
                icon={<IconMapPin size={20} />}
                disabled={form.isLoading}
                error={form.errors?.address?.message}
              />
            </Tabs.Panel>
          </Tabs>
          <footer className="mx-auto flex w-11/12 justify-end">
            <Button loading={form.isLoading} disabled={!customer.firstName} type="submit">
              {form.btnMessage}
            </Button>
          </footer>
        </form>
      </DrawerBody>
    </Drawer>
  );
};

export default CustomerForm;
