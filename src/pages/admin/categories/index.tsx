import { NextPage } from 'next';
import Layout from 'src/components/Layout';
import { useEffect } from 'react';
import CategoryDragAndDrop from 'src/components/CategoryPage/CategoryDragAndDrop';
import CategoryForm from 'src/components/CategoryPage/CategoryForm';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import {
  categoryPageSelector,
  connectToSocket,
  disconnectWebSocket,
  fetchCategories,
} from 'src/features/CategoryPage';
import { Loader } from '@mantine/core';
import { authSelector } from 'src/features/Auth';

const Categories: NextPage = () => {
  const { loading } = useAppSelector(categoryPageSelector);
  const { isAuth } = useAppSelector(authSelector);
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
        <div className="grid pt-4 pb-8 text-light md:grid-cols-2 xl:grid-cols-3">
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
