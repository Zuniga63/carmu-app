import { Button, Checkbox, Drawer, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import type { IProductWithCategories, IValidationErrors } from '@/types';
import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';
import { useProductPageStore } from '@/store/product-page.store';
import { useCreateProduct, useGetAllProducts, useUpdateProduct } from '@/hooks/react-query/product.hooks';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { IconX } from '@tabler/icons-react';

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

export default function ProductForm() {
  const { isOpen, isLargeScreen, isLoading, errors, categories, form, handleClose } = useProductForm();

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  return (
    <section className="pt-4">
      <header className="flex items-center justify-center">
        <h3 className="text-center text-xl font-bold">{form.title}</h3>
      </header>
      <form onSubmit={form.handleSubmit}>
        <div className="mx-auto mb-4 w-11/12">
          {/* PRODUCT NAME */}
          <TextInput
            label={<span className="font-sans dark:text-light">Nombre</span>}
            className="mb-2"
            placeholder="Escribe el nombre aquí."
            id="productName"
            required
            value={form.name}
            onChange={({ target }) => form.setName(target.value)}
            disabled={isLoading}
            error={errors?.name?.message}
          />

          {/* PRODUCT REF AND BARCODE */}
          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* REF */}
            <TextInput
              label={<span className="font-sans dark:text-light">Ref</span>}
              placeholder="Escribe la referencia aquí."
              id="productRef"
              value={form.ref}
              onChange={({ target }) => form.setRef(target.value)}
              disabled={isLoading}
              error={errors?.reference?.message}
            />

            {/* BARCODE */}
            <TextInput
              label={<span className="font-sans dark:text-light">Codigo</span>}
              placeholder="Escribe el codigo aquí."
              id="productBarcode"
              value={form.barcode}
              onChange={({ target }) => form.setBarcode(target.value)}
              disabled={isLoading}
              error={errors?.barcode?.message}
            />
          </div>

          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* CATEGORY */}
            <Select
              label={<span className="font-sans dark:text-light">Categoría</span>}
              placeholder="Selecciona una"
              className="mb-2"
              value={form.productCategory}
              clearable
              onChange={form.setProductCategory}
              data={categories.map(category => ({
                value: category.id,
                label: category.name,
              }))}
              error={errors?.['categoryIds.0']?.message}
            />

            {/* BARCODE */}
            <TextInput
              label={<span className="font-sans dark:text-light">Talla</span>}
              placeholder="XL, L, M, S, etc.."
              id="productSize"
              value={form.size}
              onChange={({ target }) => form.setSize(target.value)}
              disabled={isLoading}
              error={errors?.productSize?.message}
            />
          </div>

          {/* DESCRIPTION */}
          <Textarea
            label={<span className="font-sans dark:text-light">Descripción</span>}
            id="productDescription"
            placeholder="Describe el producto aquí."
            className="mb-2"
            value={form.description}
            onChange={({ target }) => form.setDescription(target.value)}
            error={errors?.description?.message}
            disabled={isLoading}
          />

          {/* PRODUCT PRICE AND PRICE WITH DISCOUNT */}
          <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* PRICE AND CHECK */}
            <div className="flex flex-col">
              <NumberInput
                label={<span className="font-sans dark:text-light">Precio</span>}
                id="productPrice"
                required
                placeholder="Escribe el precio aquí."
                className="mb-2"
                hideControls
                min={0}
                step={100}
                value={form.price}
                onChange={value => form.setPrice(value)}
                onFocus={({ target }) => target.select()}
                error={errors?.price?.message}
                parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                formatter={formater}
                disabled={isLoading}
              />

              {/* HAS DISCOUNT */}
              <Checkbox
                label={<span className="font-sans dark:text-light">Tiene descuento</span>}
                size="xs"
                checked={form.hasDiscount}
                onChange={({ currentTarget }) => form.setHasDiscount(currentTarget.checked)}
                disabled={isLoading}
              />
            </div>

            {/* PRICE WITH DISCOUNT */}
            <NumberInput
              label={<span className="font-sans dark:text-light">Precio con descuento</span>}
              id="productPriceWithDiscount"
              required
              placeholder="Escribe el precio aquí."
              hideControls
              min={0}
              step={100}
              max={form.price || undefined}
              value={form.priceWithDiscount}
              onChange={value => form.setPriceWithDiscount(value)}
              onFocus={({ target }) => target.select()}
              error={errors?.priceWithDiscount?.message}
              parser={value => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={formater}
              disabled={isLoading || !form.hasDiscount}
            />
          </div>

          {/* STOCK */}
          <NumberInput
            label={<span className="font-sans dark:text-light">Unidades en stock</span>}
            id="productStock"
            placeholder="Escribe las unidades en stock"
            className="mb-4"
            min={0}
            step={1}
            value={form.stock}
            onChange={value => form.setStock(value)}
            onFocus={({ target }) => target.select()}
            error={errors?.stock?.message}
            disabled={isLoading}
          />

          {/* PUBLISHED, INVENTORIABLE & IS NEW */}
          <div className="mb-4 flex gap-x-4">
            <Checkbox
              label={<span className="font-sans dark:text-light">Nuevo</span>}
              checked={form.published}
              onChange={({ currentTarget }) => form.setPublished(currentTarget.checked)}
              disabled={isLoading}
            />

            <Checkbox
              label={<span className="font-sans dark:text-light">Publicar</span>}
              checked={form.productIsNew}
              onChange={({ currentTarget }) => form.setProductIsNew(currentTarget.checked)}
              disabled={isLoading}
            />

            <Checkbox
              label={<span className="font-sans dark:text-light">Es inventariable</span>}
              checked={form.isInventoriable}
              onChange={({ currentTarget }) => form.setIsInventoriable(currentTarget.checked)}
              disabled={isLoading}
            />
          </div>
        </div>

        <footer className="mx-auto flex w-11/12 justify-end gap-x-3">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>

          <Button loading={isLoading} disabled={!form.name} type="submit">
            {form.btnMessage}
          </Button>
        </footer>
      </form>
    </section>
  );
}
