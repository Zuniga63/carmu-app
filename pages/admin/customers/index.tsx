import { NextPage } from 'next';
import Layout from 'components/Layout';
import { ICustomer, IInvoiceCashbox, IValidationErrors } from 'types';
import CustomerTable from 'components/CustomerPage/CustomerTable';
import { useEffect, useState } from 'react';
import CustomerForm from 'components/CustomerPage/CustomerForm';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import CustomerPaymentModal from 'components/CustomerPage/CustomerPaymentModal';
import { useAppSelector } from 'store/hooks';
import { Loader } from '@mantine/core';

const CustomerPage: NextPage = () => {
  const { isAuth } = useAppSelector(state => state.AuthReducer);

  const [fetchLoading, setFetchLoading] = useState(true);

  const [formOpened, setFormOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null | undefined>(null);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [cashboxs, setCashboxs] = useState<IInvoiceCashbox[]>([]);
  const [customerToUpdate, setCustomerToUpdate] = useState<ICustomer | null>(null);
  const [customerToPay, setCustomerToPay] = useState<ICustomer | null>(null);
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);
  const [paymentModalLoading, setPaymentModalLoading] = useState(false);
  const [paymentModalError, setPaymentModalError] = useState<unknown>(null);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get<{ customers: ICustomer[]; cashboxs: IInvoiceCashbox[] }>('/customers');
      setCustomers(res.data.customers);
      setCashboxs(res.data.cashboxs);
    } catch (error) {
      console.log(error);
      toast.error('No se ha podido cargar los datos de los clientes');
    } finally {
      setFetchLoading(false);
    }
  };

  const closeForm = () => {
    setFormOpened(false);
    setErrors(null);
    setLoading(false);
    setCustomerToUpdate(null);
  };

  const closeModal = () => {
    setPaymentModalOpened(false);
    setPaymentModalLoading(false);
    setPaymentModalError(null);
    setCustomerToPay(null);
  };

  const openForm = () => {
    setFormOpened(true);
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const { response } = error;
      setErrors(response?.data.validationErrors);
      toast.error(response?.data.message);
    } else {
      console.log(error);
    }
  };

  const storeCustomer = async (formData: unknown) => {
    const url = '/customers';
    try {
      setLoading(true);
      const res = await axios.post<{ customer: ICustomer }>(url, formData);
      const customerList = customers.slice();
      customerList.push(res.data.customer);
      customerList.sort((c1, c2) => c1.fullName.localeCompare(c2.fullName));
      setCustomers([...customerList]);
      closeForm();
      toast.success('¡Cliente guardado!');
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const mountCustomerToUpdate = (customer: ICustomer) => {
    setCustomerToUpdate(customer);
    openForm();
  };

  const mountCustomerToPayment = (customer: ICustomer) => {
    setCustomerToPay(customer);
    setPaymentModalOpened(true);
  };

  const updateCustomer = async (formData: unknown) => {
    if (customerToUpdate) {
      const url = `/customers/${customerToUpdate.id}`;
      setLoading(true);
      try {
        const res = await axios.put<{ customer: ICustomer }>(url, formData);
        const customerUpdated = res.data.customer;

        const customerIndex = customers.findIndex(customer => customer.id === customerUpdated.id);
        if (customerIndex >= 0) {
          const customerList = customers.slice();
          customerList.splice(customerIndex, 1, customerUpdated);
          customerList.sort((c1, c2) => c1.fullName.localeCompare(c2.fullName));

          setCustomers(customerList);
          closeForm();
          toast.success('¡Cliente Actualizado!');
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeCustomer = (customerToRemove: ICustomer) => {
    const customerIndex = customers.findIndex(customer => customer.id === customerToRemove.id);
    if (customerIndex >= 0) {
      const newList = customers.slice();
      newList.splice(customerIndex, 1);
      setCustomers(newList);
    }
  };

  const deleteCustomer = async (customer: ICustomer) => {
    const url = `customers/${customer.id}`;
    const message = /*html */ `
      El cliente "<strong>${customer.fullName}</strong>" 
      será eliminado permanentemente y esta acción no puede revertirse.`;

    const result = await Swal.fire({
      title: '<strong>¿Desea eliminar el cliente?</strong>',
      html: message,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, ¡Eliminalo!',
      backdrop: true,
      icon: 'warning',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const result = { ok: false, message: '' };
        try {
          const res = await axios.delete(url);
          if (res.data.ok) {
            result.ok = true;
            result.message = `¡El cliente ${customer.fullName} fue eliminado satisfactoriamente!`;
            removeCustomer(customer);
          } else {
            result.message = 'EL cliente no se pudo eliminar.';
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.status === 404) removeCustomer(customer);
            result.message = response?.data.message;
          } else {
            result.message = '¡Intentalo nuevmanete mas tarde o recarga la pagina.';
            console.log(error);
          }
        }

        return result;
      },
    });

    if (result.isConfirmed && result.value) {
      const { ok, message } = result.value;
      const title = ok ? '<strong>¡Cliente Eliminado!</strong>' : '¡Ops, algo salio mal!';
      const icon = ok ? 'success' : 'error';

      Swal.fire({ title, html: message, icon });
    }
  };

  const registerPayment = async (formData: unknown) => {
    const url = `/customers/${customerToPay?.id}/add-credit-payment`;
    try {
      setPaymentModalLoading(true);
      await axios.post(url, formData);
      const resData = await axios.get('/customers');
      setCustomers(resData.data.customers);
      setCashboxs(resData.data.cashboxs);
      closeModal();
      toast.success('¡Pago registrado');
    } catch (error) {
      setPaymentModalError(error);
    } finally {
      setPaymentModalLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchData();
    }
  }, [isAuth]);

  return (
    <Layout title="Clientes">
      {!fetchLoading ? (
        <CustomerTable
          customers={customers}
          openForm={openForm}
          mountCustomer={mountCustomerToUpdate}
          mountCustomerToPayment={mountCustomerToPayment}
          deleteCustomer={deleteCustomer}
          refresh={fetchData}
        />
      ) : (
        <div className="flex h-96 animate-pulse items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader size={40} color="red" />
            <span className="tracking-widest">Cargando la información de los clientes...</span>
          </div>
        </div>
      )}

      <CustomerForm
        opened={formOpened}
        close={closeForm}
        customer={customerToUpdate}
        store={storeCustomer}
        update={updateCustomer}
        loading={loading}
        errors={errors}
      />

      <CustomerPaymentModal
        opened={paymentModalOpened}
        customer={customerToPay}
        onClose={closeModal}
        loading={paymentModalLoading}
        error={paymentModalError}
        cashboxs={cashboxs}
        registerPayment={registerPayment}
      />
    </Layout>
  );
};

export default CustomerPage;
