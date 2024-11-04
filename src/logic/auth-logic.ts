import { authApi } from '@/services/auth-service';
import { boxesApi, mainBoxApi } from '@/services/boxes.service';
import { categoryApi } from '@/services/categories.service';
import { customerApi } from '@/services/customers.service';
import { invoiceApi } from '@/services/invoices.service';
import { premiseStoreApi } from '@/services/premise-store.service';
import { productApi } from '@/services/product.service';
import axios from 'axios';

/**
 * Se encarga de agregar el header de authorizacion a las entidades axios de la app
 * @param token Token for acces to end points
 */
export const setAccesToken = (token?: string) => {
  const authorization = token ? `Bearer ${token}` : token;

  const axiosInstances = [
    axios,
    authApi,
    premiseStoreApi,
    boxesApi,
    mainBoxApi,
    customerApi,
    productApi,
    categoryApi,
    invoiceApi,
  ];

  axiosInstances.forEach(instance => {
    instance.defaults.headers.common.Authorization = authorization;
  });
};
