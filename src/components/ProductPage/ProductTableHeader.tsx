import { useRef, useState } from 'react';
import { IconLoader2, IconReload, IconWriting, IconX } from '@tabler/icons-react';
import { ProductPageFilter, useProductPageStore } from '@/store/product-page.store';
import SearchInput from '../ui/SearchInput';
import { Button } from '../ui/Button';

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

type Props = {
  isFetching?: boolean;
  refetch?: () => void;
};

export default function ProductTableHeader({ isFetching, refetch }: Props = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const clearFilters = useProductPageStore(state => state.clearFilters);
  const showForm = useProductPageStore(state => state.showForm);

  const { loading: searchLoading, updateValue: updateSearch } = useUpdateProductFilter({ filter: 'search' });
  const { loading: sizeLoading, updateValue: updateSize } = useUpdateProductFilter({ filter: 'productSize' });
  const { loading: productRefIsLoading, updateValue: updateProductRef } = useUpdateProductFilter({
    filter: 'productRef',
  });
  const { loading: categoryIsLoading, updateValue: updateCategory } = useUpdateProductFilter({ filter: 'category' });

  const handleClearFilters = () => {
    clearFilters();
    formRef.current?.reset();
  };

  const handleShowForm = () => {
    showForm();
  };

  return (
    <header className="rounded-t-md bg-gray-300 px-6 py-2 dark:bg-header">
      <div className="flex items-center gap-x-2">
        <div className="flex-grow">
          <form onSubmit={e => e.preventDefault} ref={formRef} className="grid grid-cols-12 gap-x-2">
            <SearchInput
              placeholder="Buscar por nombre y descripcion"
              className="col-span-3 flex-grow lg:col-span-4"
              isLoading={searchLoading}
              onChange={({ currentTarget }) => updateSearch(currentTarget.value)}
              onFocus={({ target }) => {
                target.select();
              }}
            />

            <SearchInput
              placeholder="Por Categoría"
              className="col-span-3 flex-grow lg:col-span-3"
              isLoading={categoryIsLoading}
              onChange={({ target }) => updateCategory(target.value)}
              onFocus={({ target }) => {
                target.select();
              }}
            />

            <SearchInput
              placeholder="Buscar por talla"
              className="col-span-3 flex-grow lg:col-span-2"
              isLoading={sizeLoading}
              onChange={({ target }) => updateSize(target.value)}
              onFocus={({ target }) => {
                target.select();
              }}
            />

            <SearchInput
              placeholder="Por referencia"
              className="col-span-3 flex-grow lg:col-span-3"
              isLoading={productRefIsLoading}
              onChange={({ target }) => updateProductRef(target.value)}
              onFocus={({ target }) => {
                target.select();
              }}
            />
          </form>
        </div>
        <div className="flex gap-x-1">
          <Button variant={'destructive'} size={'icon'} onClick={handleClearFilters}>
            <IconX size={20} />
          </Button>

          <Button variant={'green'} size={'icon'} onClick={handleShowForm}>
            <IconWriting size={20} />
          </Button>

          <Button variant={'outline'} size={'icon'} onClick={refetch}>
            {isFetching ? <IconLoader2 size={20} className="animate-spin" /> : <IconReload size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
