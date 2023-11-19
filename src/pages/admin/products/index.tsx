import { NextPage } from 'next';
import Layout from '@/components/Layout';
import { IProductWithCategories, IValidationErrors } from '@/types';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import ProductTable from '@/components/ProductPage/ProductTable';
import ProductForm from '@/components/ProductPage/ProductForm';
import { useQueryClient } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '@/config/server-state-key.enum';
import { useGetAllProducts, useRemoveProduct } from '@/hooks/react-query/product.hooks';
import ProductDeleteDialog from '@/components/ProductPage/ProductDeleteDialog';

const ProductPage: NextPage = () => {
  const { data: products = [] } = useGetAllProducts();

  const [productToUpdate, setProductToUpdate] = useState<IProductWithCategories | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);
  const headers = { 'Content-Type': 'multipart/form-data' };
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<IProductWithCategories | null>(null);

  const {
    mutate: removeProduct,
    isPending: removeIsPending,
    isSuccess: removeIsSuccess,
    isError: removeIsError,
  } = useRemoveProduct();

  const openForm = () => setFormOpened(true);

  const mountProduct = (product: IProductWithCategories) => {
    setProductToUpdate(product);
    openForm();
  };

  const closeForm = () => {
    setFormOpened(false);
    setProductToUpdate(null);
    setLoading(false);
    setErrors(null);
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

  const storeProduct = async (formData: unknown) => {
    const url = '/products';
    try {
      setLoading(true);
      const res = await axios.post<{ product: IProductWithCategories }>(url, formData, { headers });
      const newProductList = products.slice();
      newProductList.push(res.data.product);
      newProductList.sort((p1, p2) => p1.name.localeCompare(p2.name));
      queryClient.setQueryData([ServerStateKeysEnum.ProductList], newProductList);
      // setProducts(newProductList);
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.Products] });
      closeForm();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (formData: unknown) => {
    const url = `/products/${productToUpdate?.id}`;
    try {
      setLoading(true);
      const res = await axios.put<{ product: IProductWithCategories }>(url, formData, { headers });

      const productUpdated = res.data.product;
      const list = products.slice();
      const index = list.findIndex(p => p.id === productUpdated.id);
      if (index >= 0) list.splice(index, 1, productUpdated);
      list.sort((p1, p2) => p1.name.localeCompare(p2.name));
      queryClient.setQueryData([ServerStateKeysEnum.ProductList], list);
      // setProducts(list);
      queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.Products] });

      closeForm();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = () => {
    if (removeIsPending || !productToDelete) return;
    removeProduct(productToDelete.id);
  };

  const handleMountToDelete = (product: IProductWithCategories) => {
    setProductToDelete(product);
  };

  useEffect(() => {
    if (!removeIsError) return;
    setProductToDelete(null);
    toast.error('No se pudo eliminar el producto, intentalo nuevamente');
  }, [removeIsError]);

  useEffect(() => {
    if (!removeIsSuccess) return;
    setProductToDelete(null);
    toast.success('¡Producto Eliminado!');
  }, [removeIsSuccess]);

  return (
    <Layout title="Productos">
      <ProductTable
        allProducts={products}
        openForm={openForm}
        mountProduct={mountProduct}
        onSelectProductToDelete={handleMountToDelete}
      />
      <ProductForm
        product={productToUpdate}
        loading={loading}
        errors={errors}
        opened={formOpened}
        close={closeForm}
        store={storeProduct}
        update={updateProduct}
      />

      <ProductDeleteDialog
        product={productToDelete}
        onConfirm={handleRemoveProduct}
        onCancel={() => setProductToDelete(null)}
        isLoading={removeIsPending}
      />
    </Layout>
  );
};

export default ProductPage;
