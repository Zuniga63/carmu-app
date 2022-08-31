import { GetServerSideProps, NextPage } from 'next';
import Layout from 'components/Layout';
import { Category } from 'types';
import { useEffect } from 'react';
import CategoryDragAndDrop from 'components/CategoryPage/CategoryDragAndDrop';
import CategoryForm from 'components/CategoryPage/CategoryForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  cancelCategoryToDelete,
  destroyCategory,
  fetchCategories,
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
  // const [categories, setCategories] = useState(data.categories);
  const {
    categories,
    storeNewOrderIsSuccess: mainOrderSaved,
    categoryToDelete,
    categoryDeleted,
    deleteError,
    deleteIsFinished,
  } = useAppSelector(state => state.CategoryPageReducer);
  const MySwal = withReactContent(Swal);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (categoryToDelete) {
      const message = /*html */ `La categoría "<strong>${categoryToDelete.name}</strong>" será eliminada permanentemente y no puede revertirse.`;

      MySwal.fire({
        title: <strong>¿Desea elimiar esta categoría?</strong>,
        html: message,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, eliminala.',
        backdrop: true,
        icon: 'warning',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          await Promise.all([dispatch(destroyCategory(categoryToDelete.id))]);
        },
        allowOutsideClick: () => !MySwal.isLoading(),
      }).then(result => {
        if (result.isDismissed) dispatch(cancelCategoryToDelete());
      });
    } else if (MySwal.isVisible()) {
      MySwal.close();
    }
  }, [categoryToDelete]);

  useEffect(() => {
    if (deleteIsFinished) {
      if (categoryDeleted) {
        MySwal.fire({
          title: <strong>¡Categoría Eliminada!</strong>,
          html: /* html */ `La categoría <strong>${categoryDeleted.name}</strong> fue eliminada con éxito.`,
          icon: 'success',
        });
      } else if (deleteError) {
        if (deleteError instanceof AxiosError) {
          const { response } = deleteError;
          if (response?.status === 404) dispatch(fetchCategories());
          MySwal.fire({
            title: '¡Ops, algo salio mal!',
            text: response?.data.message,
            icon: 'error',
          });
        } else {
          toast.error('¡Ops!, algo salio muy mal.');
        }
      }
    }
  }, [deleteIsFinished]);

  const saveNewMainCategoryOrder = (newList: Category[]) => {
    dispatch(storeCategoriesOrder(newList));
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
