import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { ICustomerStore, IValidationErrors } from '@/types';
import { toast } from 'react-toastify';
import { useCustomerPageStore } from '@/store/customer-store';
import { useCreateNewCustomer, useGetAllCustomers, useUpdateCustomer } from '@/hooks/react-query/customers.hooks';
import axios from 'axios';

export type DocumentType = 'CC' | 'TI' | 'NIT' | 'PAP';
export type CustomerFormProps =
  | 'firstName'
  | 'lastName'
  | 'alias'
  | 'documentType'
  | 'documentNumber'
  | 'email'
  | 'phone'
  | 'address';

export function useCustomerForm() {
  const isOpen = useCustomerPageStore(state => state.formIsOpen);
  const customerIdToUpdate = useCustomerPageStore(state => state.customerToUpdate);

  const hideForm = useCustomerPageStore(state => state.hideForm);

  const { data: customers = [] } = useGetAllCustomers();

  const [title, setTitle] = useState('');
  const [btnMessage, setBtnMessage] = useState('Guardar');
  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  // FIELDS OF FORM
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('CC');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const isLargeScreen = useMediaQuery('(min-width: 768px)');

  const {
    mutate: createCustomer,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
  } = useCreateNewCustomer();

  const {
    mutate: updateCustomer,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateCustomer();

  const isDocumentType = (value: string): value is DocumentType => {
    const allowedTypes: DocumentType[] = ['CC', 'TI', 'PAP', 'NIT'];
    return allowedTypes.includes(value as DocumentType);
  };

  const updateForm = (prop: CustomerFormProps, value: string) => {
    if (prop === 'firstName') setFirstName(value);
    else if (prop === 'lastName') setLastName(value);
    else if (prop === 'alias') setAlias(value);
    else if (prop === 'documentType' && isDocumentType(value)) setDocumentType(value);
    else if (prop === 'documentNumber') setDocumentNumber(value);
    else if (prop === 'email') setEmail(value);
    else if (prop === 'phone') setPhone(value);
    else if (prop === 'address') setAddress(value);
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

    return data;
  };

  const submit = () => {
    if (isCreatePending || isUpdatePending) return;

    const formData = getFormData();
    if (!customerIdToUpdate) createCustomer(formData);
    else updateCustomer({ data: formData, customerId: customerIdToUpdate });
  };

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setAlias('');
    setEmail('');
    setPhone('');
    setAddress('');
    setDocumentType('CC');
    setDocumentNumber('');
    setErrors(null);
  };

  useEffect(() => {
    const isSuccess = isCreateSuccess || isUpdateSuccess;
    if (!isSuccess) return;

    toast.success(isUpdateSuccess ? '¡Cliente actualizado!' : '¡Cliente guardado!');
    hideForm();
    resetFields();
  }, [isCreateSuccess, isUpdateSuccess]);

  useEffect(() => {
    const error = createError || updateError;
    if (!error) return;

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
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
  }, [isCreateError, isUpdateError]);

  useEffect(() => {
    setTitle(customerIdToUpdate ? 'Actualizar Cliente' : 'Nuevo Cliente');
    setBtnMessage(customerIdToUpdate ? 'Actualizar' : 'Guardar');
  }, [isOpen, customerIdToUpdate]);

  useEffect(() => {
    if (!customerIdToUpdate) return;
    const customer = customers.find(({ id }) => id === customerIdToUpdate);

    if (!customer) {
      hideForm();
      return;
    }

    if (customer) {
      setFirstName(customer.firstName);
      if (customer.lastName) setLastName(customer.lastName);
      if (customer.alias) setAlias(customer.alias);
      if (customer.documentType) setDocumentType(customer.documentType as DocumentType);
      if (customer.documentNumber) setDocumentNumber(customer.documentNumber);
      if (customer.email) setEmail(customer.email);
      if (customer.address) setAddress(customer.address);
      if (customer.contacts.length) setPhone(customer.contacts[0].phone);
    }
  }, [customerIdToUpdate]);

  useEffect(() => {
    const isLoading = isCreatePending || isUpdatePending;
    if (isLoading) setBtnMessage(customerIdToUpdate ? 'Actualizando...' : 'Guardando...');
    else setBtnMessage(customerIdToUpdate ? 'Actualizar' : 'Guardar');
  }, [isCreatePending, isUpdatePending]);

  return {
    form: {
      isOpen,
      title,
      btnMessage,
      errors,
      submit,
      reset: resetFields,
      isLoading: isCreatePending || isUpdatePending,
    },
    isLargeScreen,
    customer: {
      firstName,
      lastName,
      alias,
      documentType,
      documentNumber,
      email,
      phone,
      address,
    },
    updateForm,
    hideForm,
  };
}
