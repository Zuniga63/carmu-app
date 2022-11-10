import { GetServerSideProps, NextPage } from 'next';
import Layout from 'components/Layout';
import { Category, IProductWithCategories, IValidationErrors } from 'types';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ProductTable from 'components/ProductPage/ProductTable';
import ProductForm from 'components/ProductPage/ProductForm';

export const getServerSideProps: GetServerSideProps = async context => {
  const { token } = context.req.cookies;
  const data = {
    products: [],
    categories: [],
  };

  if (token) {
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const productUrl = `${baseUrl}/products`;
    const categoryUrl = `${baseUrl}/categories`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [produtRes, categoryRes] = await Promise.all([
        fetch(productUrl, { headers }),
        fetch(categoryUrl, { headers }),
      ]);

      const productResData = await produtRes.json();
      const categoryResData = await categoryRes.json();

      data.products = productResData.products;
      data.categories = categoryResData.categories;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    props: { data },
  };
};

interface Props {
  data: {
    products: IProductWithCategories[];
    categories: Category[];
  };
}

const ProductPage: NextPage<Props> = ({ data }) => {
  const [products, setProducts] = useState(data.products);
  const [productToUpdate, setProductToUpdate] = useState<IProductWithCategories | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IValidationErrors | null>(null);
  const headers = { 'Content-Type': 'multipart/form-data' };

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

  const removeProduct = (product: IProductWithCategories) => {
    const copy = products.slice();
    const index = copy.findIndex(p => p.id === product.id);
    if (index >= 0) copy.splice(index, 1);
    setProducts(copy);
  };

  const storeProduct = async (formData: unknown) => {
    const url = '/products';
    try {
      setLoading(true);
      const res = await axios.post<{ product: IProductWithCategories }>(url, formData, { headers });
      const newProductList = products.slice();
      newProductList.push(res.data.product);
      newProductList.sort((p1, p2) => p1.name.localeCompare(p2.name));
      setProducts(newProductList);
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
      setProducts(list);

      closeForm();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (product: IProductWithCategories) => {
    const url = `products/${product.id}`;
    const message = /*html */ `
      El producto "<strong>${product.name}</strong>" 
      será eliminado permanentemente y esta acción no puede revertirse.`;

    const result = await Swal.fire({
      title: '<strong>¿Desea eliminar este producto?</strong>',
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
          if (res.data.product) {
            result.ok = true;
            result.message = `¡El producto ${product.name} fue eliminado satisfactoriamente!`;
            removeProduct(product);
          } else {
            result.message = 'EL producto no se pudo eliminar.';
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.status === 404) removeProduct(product);
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
      const title = ok ? '<strong>Producto Eliminado!</strong>' : '¡Ops, algo salio mal!';
      const icon = ok ? 'success' : 'error';

      Swal.fire({ title, html: message, icon });
    }
  };

  return (
    <Layout title="Productos">
      <ProductTable
        allProducts={products}
        openForm={openForm}
        mountProduct={mountProduct}
        deleteProduct={deleteProduct}
      />
      <ProductForm
        product={productToUpdate}
        categories={data.categories}
        loading={loading}
        errors={errors}
        opened={formOpened}
        close={closeForm}
        store={storeProduct}
        update={updateProduct}
      />
    </Layout>
  );
};

export default ProductPage;
