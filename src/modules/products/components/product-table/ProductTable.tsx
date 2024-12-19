import { useEffect, useMemo, useRef, useState } from 'react';
import { IProductWithCategories } from '@/types';
import { cn, normalizeText } from '@/lib/utils';
import { ProductPageFilter, useProductPageStore } from '@/modules/products/stores/product-page.store';
import { ProductTableHeader } from '@/modules/products/components/product-table/ProductTableHeader';
import { useGetAllProducts } from '@/hooks/react-query/product.hooks';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/TablePro';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductTableContainer } from '@/modules/products/components/product-table/ProductTableContainer';
import { ProductTableItem } from '@/modules/products/components/product-table/ProductTableItem';
import { TableSkeleton } from './table-skeleton';


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

interface Props {
  className?: string;
}

export function ProductTable({ className }: Props) {
  const search = useProductPageStore(state => state.search);
  const size = useProductPageStore(state => state.productSize);
  const productRef = useProductPageStore(state => state.productRef);
  const category = useProductPageStore(state => state.category);

  const { data: allProducts = [], isLoading, isRefetching, refetch } = useGetAllProducts();

  const [page, setPage] = useState<string>('1');
  const [pages, setPages] = useState(1);
  const maxItems = 25;

  const productFiltered = useMemo(() => {
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

  const products = useMemo(() => {
    const pageValue = isNaN(parseInt(page)) ? 1 : parseInt(page);
    return productFiltered.slice((pageValue - 1) * maxItems, pageValue * maxItems);
  }, [productFiltered, page]);

  const pagMessage = useMemo(() => {
    const fromItem = maxItems * (parseInt(page) - 1) + 1;
    const toItem = Math.min(maxItems * parseInt(page), productFiltered.length);
    return `Mostrando del ${fromItem} al ${toItem} de ${productFiltered.length} productos`;
  }, [page, maxItems, productFiltered]);

  useEffect(() => {
    setPage('1');
    setPages(Math.ceil(productFiltered.length / maxItems));
  }, [productFiltered]);

  return (
    <ProductTableContainer className={className}>
      <ProductTableHeader isFetching={isLoading || isRefetching} refetch={refetch} />

      <div className="relative flex-grow">
        <Table position={'absolute'} inset={0} borderX>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="uppercase">Producto</TableHead>
              <TableHead className="uppercase">Referencias</TableHead>
              <TableHead className="uppercase">Categorías</TableHead>
              <TableHead className="text-center uppercase">Talla</TableHead>
              <TableHead className="text-center uppercase">Stock</TableHead>
              <TableHead className="text-right uppercase">Precio</TableHead>
              <TableHead className="relative">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableSkeleton isLoading={isLoading} />
            {products.map(product => (
              <ProductTableItem product={product} key={product.id} />
            ))}
          </TableBody>
        </Table>
      </div>

      <footer className={cn('flex items-center justify-between bg-gray-300 px-6 py-2 dark:bg-header')}>
        <div className={cn('flex items-center gap-x-4')}>
          <div className={cn('w-16', { hidden: pages <= 1 })}>
            <Select value={page} onValueChange={setPage}>
              <SelectTrigger>
                <SelectValue placeholder="Pag" />
              </SelectTrigger>
              <SelectContent>
                {Array(pages)
                  .fill(null)
                  .map((_, index) => (
                    <SelectItem key={index} value={String(index + 1)}>
                      {index + 1}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm italic text-neutral-400">{pagMessage}</p>
        </div>
        <span className="text-xs italic">Area reservada</span>
      </footer>
    </ProductTableContainer>
  );
}
