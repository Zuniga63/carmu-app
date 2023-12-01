import React, { useMemo, useRef, useState } from 'react';
import { ActionIcon, Loader, ScrollArea, TextInput } from '@mantine/core';
import { IconSearch, IconWriting, IconX } from '@tabler/icons-react';
import { IProductWithCategories } from '@/types';
import ProductTableItem from './ProductTableItem';
import { normalizeText } from '@/utils';

interface Props {
  allProducts: IProductWithCategories[];
  openForm(): void;
  mountProduct(product: IProductWithCategories): void;
  onSelectProductToDelete(product: IProductWithCategories): void;
}

export function useTextInputChange() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const updateValue = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setLoading(true);
    debounceInterval.current = setTimeout(() => {
      setLoading(false);
      setValue(value);
    }, 350);
  };

  return { value, loading, updateValue };
}

const ProductTable = ({ allProducts, openForm, mountProduct, onSelectProductToDelete }: Props) => {
  const { value: search, loading: searchLoading, updateValue: updateSearch } = useTextInputChange();
  const { value: size, loading: sizeLoading, updateValue: updateSize } = useTextInputChange();
  const { value: productRef, loading: productRefIsLoading, updateValue: updateProductRef } = useTextInputChange();
  const { value: category, loading: categoryIsLoading, updateValue: updateCategory } = useTextInputChange();
  const formRef = useRef<HTMLFormElement>(null);

  const products = useMemo(() => {
    if (!search && !size && !productRef && !category) return allProducts;

    let result: IProductWithCategories[] = [];

    if (search) {
      result = result.filter(item => {
        const text = normalizeText([item.name, item.description || ''].join(' ').trim());
        return text.includes(normalizeText(search));
      });
    }

    if (category) {
      result = allProducts.filter(item => {
        const categoryText = item.categories
          .map(c => c.name)
          .join(' ')
          .trim();
        if (!categoryText || categoryText.length === 0) return false;
        const text = normalizeText(categoryText);
        return text.includes(normalizeText(category));
      });
    }

    if (size) {
      result = allProducts.filter(item => {
        if (!item.productSize || item.productSize.length === 0) return false;
        const text = normalizeText(item.productSize);
        return text.includes(normalizeText(size));
      });
    }

    if (productRef) {
      result = allProducts.filter(item => {
        const refText = [item.ref || '', item.barcode || ''].join(' ').trim();
        if (!refText || refText.length === 0) return false;
        const text = normalizeText(refText);
        return text.includes(normalizeText(productRef));
      });
    }

    return result;
  }, [allProducts, search, size, productRef, category]);

  const handleClearFilters = () => {
    updateSearch('');
    updateSize('');
    updateProductRef('');
    updateCategory('');
    formRef.current?.reset();
  };

  return (
    <div className="mx-auto w-11/12 pt-4 dark:text-light">
      <header className="rounded-t-md bg-gray-300 px-6 py-2 dark:bg-header">
        <div className="flex items-center gap-x-2">
          <div className="flex-grow">
            <form onSubmit={e => e.preventDefault} ref={formRef} className="grid grid-cols-12 gap-x-2">
              <TextInput
                size="xs"
                type="search"
                icon={searchLoading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
                placeholder="Buscar por nombre y descripcion"
                role="search"
                className="col-span-3 flex-grow lg:col-span-4"
                onChange={({ target }) => updateSearch(target.value)}
                onFocus={({ target }) => {
                  target.select();
                }}
              />

              <TextInput
                size="xs"
                type="search"
                icon={categoryIsLoading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
                placeholder="Por Categoría"
                role="search"
                className="col-span-3 flex-grow lg:col-span-3"
                onChange={({ target }) => updateCategory(target.value)}
                onFocus={({ target }) => {
                  target.select();
                }}
              />

              <TextInput
                size="xs"
                type="search"
                icon={sizeLoading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
                placeholder="Buscar por talla"
                role="search"
                className="col-span-3 flex-grow lg:col-span-2"
                onChange={({ target }) => updateSize(target.value)}
                onFocus={({ target }) => {
                  target.select();
                }}
              />

              <TextInput
                size="xs"
                type="search"
                icon={productRefIsLoading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
                placeholder="Por referencia"
                role="search"
                className="col-span-3 flex-grow lg:col-span-3"
                onChange={({ target }) => updateProductRef(target.value)}
                onFocus={({ target }) => {
                  target.select();
                }}
              />
            </form>
          </div>
          <div className="flex gap-x-1">
            <ActionIcon variant="filled" size="lg" color="red" onClick={handleClearFilters}>
              <IconX size={20} />
            </ActionIcon>
            <ActionIcon variant="filled" size="lg" color="blue" onClick={() => openForm()}>
              <IconWriting size={20} />
            </ActionIcon>
          </div>
        </div>
      </header>
      <ScrollArea className="relative h-[26rem] overflow-y-auto border border-y-0 border-x-gray-300 dark:border-x-header 3xl:h-[70vh]">
        <table className='class="relative mb-2" min-w-full table-auto'>
          <thead className="sticky top-0 bg-gray-400 dark:bg-dark">
            <tr className="text-dark dark:text-gray-300">
              <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                Producto
              </th>
              <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                Referencias
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-center uppercase tracking-wide">
                Categorías
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-center uppercase tracking-wide">
                Talla
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-center uppercase tracking-wide">
                Stock
              </th>
              <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                Precio
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {products.map(product => (
              <ProductTableItem
                product={product}
                key={product.id}
                mount={mountProduct}
                onDelete={onSelectProductToDelete}
              />
            ))}
          </tbody>
        </table>
      </ScrollArea>
      <footer className="flex justify-end rounded-b-md bg-gray-300 px-6 py-2 dark:bg-header">
        <span>Productos: {allProducts.length} </span>
      </footer>
    </div>
  );
};

export default ProductTable;
