import { Button, Checkbox, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useProductForm } from '../hooks/use-product-form';

export function ProductForm() {
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