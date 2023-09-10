import { NextPage } from 'next';
import Layout from '@/components/Layout';
import { useEffect } from 'react';
import CategoryDragAndDrop from '@/components/CategoryPage/CategoryDragAndDrop';
import CategoryForm from '@/components/CategoryPage/CategoryForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { categoryPageSelector, connectToSocket, disconnectWebSocket, fetchCategories } from '@/features/CategoryPage';
import { Loader } from '@mantine/core';
import { useAuthStore } from '@/store/auth-store';

const Categories: NextPage = () => {
  const { loading } = useAppSelector(categoryPageSelector);
  const isAuth = useAuthStore(state => state.isAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connectToSocket());

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchCategories());
    }
  }, [isAuth]);

  return (
    <>
      <Layout title="Categorías">
        <div className="grid pb-8 pt-4 text-light md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <Loader />
              <p className="animate-pulse text-sm">Recuperando categorías...</p>
            </div>
          ) : (
            <CategoryDragAndDrop title="Categorías Primarias" />
          )}
        </div>
      </Layout>

      <CategoryForm />
    </>
  );
};

export default Categories;
