import { NextPage } from 'next';
import Layout from '@/components/Layout';
import { ProductForm } from '@/modules/products/components/ProductForm';
import { ProductDeleteDialog } from '@/modules/products/components/ProductDeleteDialog';
import { ProductPageContainer } from '@/modules/products/components/ProductPageContainer';
import ProductTable from '@/modules/products/components/product-table';
import { ProductQRGenerator } from '@/modules/products/components/ProductQRGenerator';

const ProductPage: NextPage = () => {
  return (
    <Layout title="Productos">
      <ProductPageContainer>
        <ProductTable className="col-span-3" />
        <div className="col-span-1 bg-neutral-900 p-2">
          <ProductForm />
        </div>
      </ProductPageContainer>
      <ProductDeleteDialog />
      <ProductQRGenerator />
    </Layout>
  );
};

export default ProductPage;
