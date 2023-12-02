import { useRef, useState } from 'react';
import { ActionIcon, Loader, TextInput } from '@mantine/core';
import { IconReload, IconSearch, IconWriting, IconX } from '@tabler/icons-react';
import { ProductPageFilter, useProductPageStore } from '@/store/product-page.store';

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
          <ActionIcon variant="filled" size="lg" color="green" onClick={handleShowForm}>
            <IconWriting size={20} />
          </ActionIcon>
          <ActionIcon loading={isFetching} variant="filled" size="lg" color="blue" onClick={refetch}>
            <IconReload size={20} />
          </ActionIcon>
        </div>
      </div>
    </header>
  );
}
