import { Button, Drawer, SegmentedControl, Tabs, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconAt, IconMapPin, IconPhone, IconUser } from '@tabler/icons';
import DrawerBody from 'src/components/DrawerBody';
import DrawerHeader from 'src/components/DrawerHeader';
import React, { FormEvent, useEffect, useState } from 'react';
import { IValidationErrors } from 'src/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { customerPageSelector, hideCustomerForm, storeCustomer, updateCustomer } from 'src/features/CustomerPage';
import { toast } from 'react-toastify';
import { ICustomerStore } from 'src/features/CustomerPage/types';

const CustomerForm = () => {
  const dispatch = useAppDispatch();
  const {
    customerToUpdate: customer,
    customerFormOpened: opened,
    customerFormIsSuccess: isSuccess,
    customerFormError: error,
    customerFormIsLoading: loading,
  } = useAppSelector(customerPageSelector);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);
  const [successShow, setSuccessShow] = useState(true);

  const [title, setTitle] = useState('');
  const [btnMessage, setBtnMessage] = useState('Guardar');

  // FIELDS OF FORM
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');
  const [documentType, setDocumentType] = useState<'CC' | 'TI' | 'NIT' | 'PAP' | string>('CC');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const largeScreen = useMediaQuery('(min-width: 768px)');

  ///---------------------------------------------------------------------------
  // FUNTIONALITY
  ///---------------------------------------------------------------------------
  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setAlias('');
    setEmail('');
    setPhone('');
    setAddress('');
    setDocumentType('CC');
    setDocumentNumber('');
  };

  const onCloseHandler = () => {
    if (!loading) {
      dispatch(hideCustomerForm());
      resetFields();
    }
  };

  const getFormData = () => {
    const data: ICustomerStore = {
      firstName,
      contacts: [],
    };

    if (lastName) data.lastName = lastName;
    if (alias) data.alias = alias;
    if (documentNumber) {
      data.documentType = documentType || 'CC';
      data.documentNumber = documentNumber;
    }
    if (email) data.email = email;
    if (address) data.address = address;
    if (phone) data.contacts.push({ phone, description: 'Telefono' });
    if (customer) data.id = customer.id;

    return data;
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = getFormData();
    if (!customer) dispatch(storeCustomer(formData));
    else dispatch(updateCustomer(formData));
  };

  useEffect(() => {
    if (isSuccess && !successShow) {
      const message = customer ? '¡Cliente actualizado!' : '¡Cliente guardado!';
      toast.success(message);
      setSuccessShow(true);
      dispatch(hideCustomerForm());
      resetFields();
    } else {
      setSuccessShow(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      const { data, status } = error;
      if (status === 422 && data.validationErrors) {
        setErrors(data.validationErrors);
      } else if (status === 401) {
        toast.error(data.message);
      } else {
        console.log(error);
      }
    } else {
      setErrors(null);
    }
  }, [error]);

  useEffect(() => {
    setTitle(customer ? 'Actualizar Cliente' : 'Nuevo Cliente');
    setBtnMessage(customer ? 'Actualizar' : 'Guardar');
    if (customer) {
      setFirstName(customer.firstName);
      if (customer.lastName) setLastName(customer.lastName);
      if (customer.alias) setAlias(customer.alias);
      if (customer.documentType) setDocumentType(customer.documentType);
      if (customer.documentNumber) setDocumentNumber(customer.documentNumber);
      if (customer.email) setEmail(customer.email);
      if (customer.address) setAddress(customer.address);
      if (customer.contacts.length) setPhone(customer.contacts[0].phone);
    }
  }, [customer]);

  useEffect(() => {
    if (loading) setBtnMessage(customer ? 'Actualizando...' : 'Guardando...');
    else setBtnMessage(customer ? 'Actualizar' : 'Guardar');
  }, [loading]);

  return (
    <Drawer
      opened={opened}
      onClose={onCloseHandler}
      padding={0}
      size={largeScreen ? 'lg' : '100%'}
      withCloseButton={false}
      position="right"
    >
      <DrawerHeader title={title} onClose={onCloseHandler} />
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
                value={firstName}
                onChange={({ target }) => setFirstName(target.value)}
                disabled={loading}
                error={errors?.firstName?.message}
              />

              {/* LAST NAME */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Apellidos</span>}
                className="mb-2"
                placeholder="Escribe los apellidos aquí"
                id="customerLastName"
                value={lastName}
                onChange={({ target }) => setLastName(target.value)}
                disabled={loading}
                error={errors?.lastName?.message}
              />

              {/* ALIAS */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Alias</span>}
                className="mb-2"
                placeholder="A.K.A"
                id="customerAlias"
                value={alias}
                onChange={({ target }) => setAlias(target.value)}
                disabled={loading}
                error={errors?.alias?.message}
              />

              {/* DOCUMENT */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Identificación</span>}
                className="mb-2"
                placeholder="#.###.###.###"
                id="customerDocument"
                value={documentNumber}
                onChange={({ target }) => setDocumentNumber(target.value)}
                disabled={loading}
                error={errors?.documentNumber?.message}
              />

              {/* DOCUMENT TYPE */}
              <SegmentedControl
                value={documentType}
                onChange={setDocumentType}
                fullWidth
                disabled={loading}
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
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                type="email"
                icon={<IconAt size={20} />}
                disabled={loading}
                error={errors?.email?.message}
              />

              {/* PHONE */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Telefono</span>}
                className="mb-2"
                placeholder="555-5555"
                id="customerPhone"
                value={phone}
                onChange={({ target }) => setPhone(target.value)}
                type="tel"
                icon={<IconPhone size={20} />}
                disabled={loading}
                error={errors?.['contact.1.phone']?.message}
              />

              {/* ADDRESS */}
              <TextInput
                label={<span className="font-sans text-gray-dark dark:text-light">Dirección</span>}
                className="mb-2"
                placeholder="Avenida siempre vida 1234"
                id="customerAddress"
                value={address}
                onChange={({ target }) => setAddress(target.value)}
                icon={<IconMapPin size={20} />}
                disabled={loading}
                error={errors?.address?.message}
              />
            </Tabs.Panel>
          </Tabs>
          <footer className="mx-auto flex w-11/12 justify-end">
            <Button loading={loading} disabled={!firstName} type="submit">
              {btnMessage}
            </Button>
          </footer>
        </form>
      </DrawerBody>
    </Drawer>
  );
};

export default CustomerForm;
