import { NextPage } from 'next';
import Layout from '@/components/Layout';
import ProductTable from '@/components/ProductPage/ProductTable';
import ProductForm from '@/components/ProductPage/ProductForm';
import ProductDeleteDialog from '@/components/ProductPage/ProductDeleteDialog';

const ProductPage: NextPage = () => {
  return (
    <Layout title="Productos">
      <div className="grid grid-cols-4 gap-x-4">
        <div className="col-span-3 px-8">
          <ProductTable />
        </div>
        <ProductForm />
      </div>
      <ProductDeleteDialog />
    </Layout>
  );
};

export default ProductPage;
