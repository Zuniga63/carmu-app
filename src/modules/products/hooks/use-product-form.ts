import { useMediaQuery } from '@mantine/hooks';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { IProductWithCategories, IValidationErrors } from '@/types';
import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';
import { useProductPageStore } from '@/modules/products/stores/product-page.store';
import { useCreateProduct, useGetAllProducts, useUpdateProduct } from '@/hooks/react-query/product.hooks';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export function useProductForm() {
  const isOpen = useProductPageStore(state => state.formIsOpen);
  const productId = useProductPageStore(state => state.productToEditId);
  const closeForm = useProductPageStore(state => state.hideForm);

  const [formTitle, setFormTitle] = useState('Registrar Producto');
  const [btnMessage, setBtnMessage] = useState('Guardar');
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [ref, setRef] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [priceWithDiscount, setPriceWithDiscount] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number | undefined>(0);
  const [productIsNew, setProductIsNew] = useState(false);
  const [published, setPublished] = useState(false);
  const [isInventoriable, setIsInventoriable] = useState(false);

  const isLargeScreen = useMediaQuery('(min-width: 768px)');

  const [errors, setErrors] = useState<IValidationErrors | null>(null);

  const { data: categories = [] } = useGetAllCategories();
  const { data: products = [] } = useGetAllProducts();

  const mountProduct = useCallback((product: IProductWithCategories) => {
    setFormTitle('Actualizar Producto');
    setBtnMessage('Actualizar');
    setName(product.name);
    setRef(product.ref || '');
    setBarcode(product.barcode || '');
    if (product.categories.length > 0) setProductCategory(product.categories[0].id);
    setDescription(product.description || '');
    setSize(product.productSize || '');
    setPrice(product.price);
    setHasDiscount(Boolean(product.hasDiscount));
    setPriceWithDiscount(product.priceWithDiscount);
    setStock(product.stock);
    setIsInventoriable(product.isInventoriable);
    setProductIsNew(Boolean(product.productIsNew));
    setPublished(Boolean(product.published));
  }, []);

  const {
    mutate: createProduct,
    isPending: createIsPending,
    isSuccess: createIsSusscess,
    error: createError,
  } = useCreateProduct();

  const {
    mutate: updateProduct,
    isPending: updateIsPending,
    isSuccess: updateIsSusscess,
    error: updateError,
  } = useUpdateProduct();

  const reset = () => {
    setFormTitle('Registrar Producto');
    setBtnMessage('Guardar');
    setProductCategory('');
    setName('');
    setRef('');
    setBarcode('');
    setDescription('');
    setSize('');
    setPrice(undefined);
    setHasDiscount(false);
    setPriceWithDiscount(undefined);
    setProductIsNew(false);
    setPublished(false);
    setIsInventoriable(false);
    setStock(undefined);
  };

  const getFormData = () => {
    const formData = new FormData();
    const product = products.find(p => p.id === productId);

    formData.append('name', name);
    formData.append('categoryIds', productCategory || '');
    if (ref) formData.append('ref', ref);
    if (barcode) formData.append('barcode', barcode);
    if (description) formData.append('description', description);
    if (size) formData.append('productSize', size);
    formData.append('price', String(price));
    if (hasDiscount && priceWithDiscount) {
      formData.append('hasDiscount', String(hasDiscount));
      formData.append('priceWithDiscount', String(priceWithDiscount));
    }
    if (productIsNew) formData.append('productIsNew', String(productIsNew));
    if (published) formData.append('published', String(published));
    if (stock && stock >= 0) formData.append(!product ? 'initialStock' : 'stock', String(stock));
    if (isInventoriable) formData.append('isInventoriable', 'true');

    return formData;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !price || createIsPending || updateIsPending) return;

    const formData = getFormData();
    if (!productId) createProduct(formData);
    else updateProduct({ formData, id: productId });
  };

  const handleClose = () => {
    const isPendign = createIsPending || updateIsPending;
    if (isPendign) return;
    reset();
    closeForm();
  };

  useEffect(() => {
    if (!isOpen) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    mountProduct(product);
  }, [isOpen, productId]);

  useEffect(() => {
    const isPendign = createIsPending || updateIsPending;
    if (productId) setBtnMessage(isPendign ? 'Actualizando...' : 'Actualizar');
    else setBtnMessage(isPendign ? 'Guardando...' : 'Guardar');
  }, [createIsPending, updateIsPending]);

  useEffect(() => {
    const isSuccessful = createIsSusscess || updateIsSusscess;
    if (!isSuccessful) return;

    closeForm();
  }, [createIsSusscess, updateIsSusscess]);

  useEffect(() => {
    const error = createError || updateError;
    if (!error) return;

    if (error instanceof AxiosError) {
      const { response } = error;
      setErrors(response?.data.validationErrors);
      toast.error(response?.data.message);
    } else {
      console.log(error);
    }
  }, [createError, updateError]);

  return {
    isOpen,
    isLargeScreen,
    categories,
    isLoading: createIsPending || updateIsPending,
    form: {
      title: formTitle,
      btnMessage,
      productCategory,
      name,
      ref,
      barcode,
      description,
      size,
      price,
      hasDiscount,
      priceWithDiscount,
      stock,
      productIsNew,
      published,
      isInventoriable,
      setProductCategory,
      setName,
      setRef,
      setBarcode,
      setDescription,
      setSize,
      setPrice,
      setHasDiscount,
      setPriceWithDiscount,
      setStock,
      setProductIsNew,
      setPublished,
      setIsInventoriable,
      reset,
      handleSubmit,
    },
    errors,
    handleClose,
  };
}