import { Button, Checkbox, Drawer, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { FormEvent, useEffect, useState } from 'react';
import type { IProductWithCategories, IValidationErrors } from '@/types';
import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';

interface Props {
  product?: IProductWithCategories | null;
  opened: boolean;
  loading: boolean;
  errors: IValidationErrors | null | undefined;
  close(): void;
  store(formData: unknown): Promise<void>;
  update(formData: unknown): Promise<void>;
}

const ProductForm = ({ product, opened, loading, errors, close, store, update }: Props) => {
  const { data: categories = [] } = useGetAllCategories();
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

  const largeScreen = useMediaQuery('(min-width: 768px)');

  //---------------------------------------------------------------------------
  // FUNCTIONALITY
  //---------------------------------------------------------------------------
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

  const formater = (value: string | undefined) => {
    let result = '$ ';
    if (value && !Number.isNaN(parseFloat(value))) {
      result = `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return result;
  };

  const getFormData = () => {
    const formData = new FormData();
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

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name && price) {
      const formData = getFormData();
      if (!product) store(formData);
      else update(formData);
    }
  };

  //---------------------------------------------------------------------------
  // EFFECTS
  //---------------------------------------------------------------------------
  useEffect(() => {
    if (opened) {
      setFormTitle(product ? 'Actualizar Producto' : 'Registrar Producto');
      setBtnMessage(product ? 'Actualizar' : 'Guardar');
      if (product) {
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
      }
    } else {
      reset();
    }
  }, [opened]);

  useEffect(() => {
    if (loading) setBtnMessage(product ? 'Actualizando...' : 'Guardando...');
    else setBtnMessage(product ? 'Actualizar' : 'Guardar');
  }, [loading]);

  return (
    <Drawer
      opened={opened}
      onClose={close}
      padding="xs"
      size={largeScreen ? 'xl' : '100%'}
      position="right"
      title={formTitle}
    >
      <form onSubmit={onSubmitHandler}>
        <div className="mx-auto mb-4 w-11/12">
          {/* PRODUCT NAME */}
          <TextInput
            label={<span className="font-sans dark:text-light">Nombre</span>}
            className="mb-2"
            placeholder="Escribe el nombre aquí."
            id="productName"
            required
            value={name}
            onChange={({ target }) => setName(target.value)}
            disabled={loading}
            error={errors?.name?.message}
          />

          {/* PRODUCT REF AND BARCODE */}
          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* REF */}
            <TextInput
              label={<span className="font-sans dark:text-light">Ref</span>}
              placeholder="Escribe la referencia aquí."
              id="productRef"
              value={ref}
              onChange={({ target }) => setRef(target.value)}
              disabled={loading}
              error={errors?.reference?.message}
            />

            {/* BARCODE */}
            <TextInput
              label={<span className="font-sans dark:text-light">Codigo</span>}
              placeholder="Escribe el codigo aquí."
              id="productBarcode"
              value={barcode}
              onChange={({ target }) => setBarcode(target.value)}
              disabled={loading}
              error={errors?.barcode?.message}
            />
          </div>

          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* CATEGORY */}
            <Select
              label={<span className="font-sans dark:text-light">Categoría</span>}
              placeholder="Selecciona una"
              className="mb-2"
              value={productCategory}
              clearable
              onChange={setProductCategory}
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
              value={size}
              onChange={({ target }) => setSize(target.value)}
              disabled={loading}
              error={errors?.productSize?.message}
            />
          </div>

          {/* DESCRIPTION */}
          <Textarea
            label={<span className="font-sans dark:text-light">Descripción</span>}
            id="productDescription"
            placeholder="Describe el producto aquí."
            className="mb-2"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            error={errors?.description?.message}
            disabled={loading}
          />

          {/* PRODUCT PRICE AND PRICE WITH DISCOUNT */}
          <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* PRICE AND CHECK */}
            <div className=" flex flex-col">
              <NumberInput
                label={<span className="font-sans dark:text-light">Precio</span>}
                id="productPrice"
                required
                placeholder="Escribe el precio aquí."
                className="mb-2"
                hideControls
                min={0}
                step={100}
                value={price}
                onChange={value => setPrice(value)}
                onFocus={({ target }) => target.select()}
                error={errors?.price?.message}
                parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                formatter={formater}
                disabled={loading}
              />

              {/* HAS DISCOUNT */}
              <Checkbox
                label={<span className="font-sans dark:text-light">Tiene descuento</span>}
                size="xs"
                checked={hasDiscount}
                onChange={({ currentTarget }) => setHasDiscount(currentTarget.checked)}
                disabled={loading}
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
              max={price || undefined}
              value={priceWithDiscount}
              onChange={value => setPriceWithDiscount(value)}
              onFocus={({ target }) => target.select()}
              error={errors?.priceWithDiscount?.message}
              parser={value => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={formater}
              disabled={loading || !hasDiscount}
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
            value={stock}
            onChange={value => setStock(value)}
            onFocus={({ target }) => target.select()}
            error={errors?.stock?.message}
            disabled={loading}
          />

          {/* PUBLISHED, INVENTORIABLE & IS NEW */}
          <div className="mb-4 flex gap-x-4">
            <Checkbox
              label={<span className="font-sans dark:text-light">Nuevo</span>}
              checked={published}
              onChange={({ currentTarget }) => setPublished(currentTarget.checked)}
              disabled={loading}
            />

            <Checkbox
              label={<span className="font-sans dark:text-light">Publicar</span>}
              checked={productIsNew}
              onChange={({ currentTarget }) => setProductIsNew(currentTarget.checked)}
              disabled={loading}
            />

            <Checkbox
              label={<span className="font-sans dark:text-light">Es inventariable</span>}
              checked={isInventoriable}
              onChange={({ currentTarget }) => setIsInventoriable(currentTarget.checked)}
              disabled={loading}
            />
          </div>
        </div>

        <footer className="mx-auto flex w-11/12 justify-end">
          <Button loading={loading} disabled={!name} type="submit">
            {btnMessage}
          </Button>
        </footer>
      </form>
    </Drawer>
  );
};

export default ProductForm;
