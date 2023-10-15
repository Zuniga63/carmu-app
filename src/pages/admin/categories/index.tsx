import { NextPage } from 'next';
import Layout from '@/components/Layout';
import CategoryDragAndDrop from '@/components/CategoryPage/CategoryDragAndDrop';
import CategoryForm from '@/components/CategoryPage/CategoryForm';
import { Loader } from '@mantine/core';
import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';
import CategoryDeleteModal from '@/components/CategoryPage/category-delete-modal';

const Categories: NextPage = () => {
  const { isLoading } = useGetAllCategories();

  return (
    <>
      <Layout title="Categorías">
        <div className="grid pb-8 pt-4 text-light md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <Loader />
              <p className="animate-pulse text-sm">Recuperando categorías...</p>
            </div>
          ) : (
            <CategoryDragAndDrop title="Categorías Primarias" />
          )}
        </div>
      </Layout>

      <CategoryDeleteModal />
      <CategoryForm />
    </>
  );
};

export default Categories;
