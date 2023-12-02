import { NextPage } from 'next';
import Layout from '@/components/Layout';
import ProductTable from '@/components/ProductPage/ProductTable';
import ProductForm from '@/components/ProductPage/ProductForm';
import ProductDeleteDialog from '@/components/ProductPage/ProductDeleteDialog';

const ProductPage: NextPage = () => {
  return (
    <Layout title="Productos">
      <ProductTable />
      <ProductForm />
      <ProductDeleteDialog />
    </Layout>
  );
};

export default ProductPage;
