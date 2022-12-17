import { GetServerSideProps, NextPage } from 'next';
import Layout from 'components/Layout';
import { Category } from 'types';
import { useEffect } from 'react';
import CategoryDragAndDrop from 'components/CategoryPage/CategoryDragAndDrop';
import CategoryForm from 'components/CategoryPage/CategoryForm';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  connectToSocket,
  disconnectWebSocket,
  setCategories,
  showCategoryForm,
  storeCategoriesOrder,
} from 'store/reducers/CategoryPage/creators';

interface Props {
  data: {
    categories: Category[];
  };
}

const Categories: NextPage<Props> = ({ data }: Props) => {
  const { categories, storeNewOrderIsSuccess: mainOrderSaved } = useAppSelector(
    state => state.CategoryPageReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connectToSocket());
    dispatch(setCategories(data.categories));

    return () => {
      dispatch(disconnectWebSocket());
    };
  }, []);

  const saveNewMainCategoryOrder = (newList: Category[]) => {
    dispatch(storeCategoriesOrder(newList, categories.slice()));
  };

  return (
    <>
      <Layout title="Categorías">
        <div className="grid pt-4 pb-8 text-light md:grid-cols-2 xl:grid-cols-3">
          <CategoryDragAndDrop
            title="Categorías Primarias"
            categories={categories}
            saveOrder={saveNewMainCategoryOrder}
            newOrderSaved={mainOrderSaved}
            btnAction={() => dispatch(showCategoryForm())}
          />
        </div>
      </Layout>

      <CategoryForm />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async contex => {
  const { token } = contex.req.cookies;
  const data = {
    categories: [],
  };

  if (token) {
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const url = `${baseUrl}/categories`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(url, { headers });
      const resData = await res.json();
      data.categories = resData.categories;
    } catch (error) {
      data.categories = [];
    }
  }

  return {
    props: {
      data,
    },
  };
};

export default Categories;
