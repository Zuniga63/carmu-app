import { useMemo, useRef, useState } from 'react';
import { ScrollArea } from '@mantine/core';
import { IProductWithCategories } from '@/types';
import ProductTableItem from './ProductTableItem';
import { normalizeText } from '@/lib/utils';
import { ProductPageFilter, useProductPageStore } from '@/store/product-page.store';
import ProductTableHeader from './ProductTableHeader';
import { useGetAllProducts } from '@/hooks/react-query/product.hooks';

export function useUpdateProductFilter({ filter }: { filter?: ProductPageFilter } = {}) {
  const updateFilter = useProductPageStore(state => state.updateFilter);

  const [loading, setLoading] = useState(false);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const updateValue = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setLoading(true);
    debounceInterval.current = setTimeout(() => {
      setLoading(false);
      if (filter) updateFilter(filter, value);
    }, 350);
  };

  return { loading, updateValue };
}

const ProductTable = () => {
  const search = useProductPageStore(state => state.search);
  const size = useProductPageStore(state => state.productSize);
  const productRef = useProductPageStore(state => state.productRef);
  const category = useProductPageStore(state => state.category);

  const { data: allProducts = [], isLoading, isRefetching, refetch } = useGetAllProducts();

  const products = useMemo(() => {
    let result: IProductWithCategories[] = allProducts.slice();

    if (search) {
      result = result.filter(item => {
        const text = normalizeText([item.name, item.description || ''].join(' ').trim());
        return text.includes(normalizeText(search));
      });
    }

    if (category) {
      result = result.filter(item => {
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
      result = result.filter(item => {
        if (!item.productSize || item.productSize.length === 0) return false;
        const text = normalizeText(item.productSize);
        return text.includes(normalizeText(size));
      });
    }

    if (productRef) {
      result = result.filter(item => {
        const refText = [item.ref || '', item.barcode || ''].join(' ').trim();
        if (!refText || refText.length === 0) return false;
        const text = normalizeText(refText);
        return text.includes(normalizeText(productRef));
      });
    }

    return result;
  }, [allProducts, search, size, productRef, category]);

  return (
    <div className="mx-auto flex h-full w-11/12 flex-col pb-2 pt-4 dark:text-light">
      <div className="flex h-full w-full flex-col">
        <ProductTableHeader isFetching={isLoading || isRefetching} refetch={refetch} />

        <div className="relative flex-grow">
          <div className="relative h-full">
            <div className="absolute inset-0 overflow-y-auto border border-y-0 border-x-gray-300 dark:border-x-header">
              <table className="min-w-full table-auto">
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
                    <ProductTableItem product={product} key={product.id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <footer className="flex justify-end rounded-b-md bg-gray-300 px-6 py-2 dark:bg-header">
          <span>
            Productos: {products.length}/{allProducts.length}
          </span>
        </footer>
      </div>
    </div>
  );
};

export default ProductTable;
