import { useRef, useState } from 'react';
import { IconLoader2, IconReload, IconWriting, IconX } from '@tabler/icons-react';
import { ProductPageFilter, useProductPageStore } from '@/store/product-page.store';
import SearchInput from '../ui/SearchInput';
import { Button } from '../ui/Button';
import { useGetAllCategories } from '@/hooks/react-query/categories.hooks';
import { Select, SelectContent, SelectValue, SelectItem, SelectTrigger } from '../ui/select';

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
  const updateFilter = useProductPageStore(state => state.updateFilter);
  const category = useProductPageStore(state => state.category);

  const { loading: searchLoading, updateValue: updateSearch } = useUpdateProductFilter({ filter: 'search' });
  const { loading: sizeLoading, updateValue: updateSize } = useUpdateProductFilter({ filter: 'productSize' });
  const { loading: productRefIsLoading, updateValue: updateProductRef } = useUpdateProductFilter({
    filter: 'productRef',
  });

  const { data: categories = [] } = useGetAllCategories();
  // ? This is a hack to force the select to update when the categories change
  const [selectKey, setSelectKey] = useState(+new Date());

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
          <form onSubmit={e => e.preventDefault} ref={formRef} className="grid grid-cols-12 items-center gap-x-2">
            <SearchInput
              placeholder="Buscar por nombre y descripcion"
              className="col-span-3 flex-grow lg:col-span-4"
              isLoading={searchLoading}
              onChange={({ currentTarget }) => updateSearch(currentTarget.value)}
              onFocus={({ target }) => {
                target.select();
              }}
            />

            <Select key={selectKey} value={category} onValueChange={value => updateFilter('category', value)}>
              <SelectTrigger className="col-span-3 h-9 flex-grow lg:col-span-3">
                <SelectValue placeholder="Por Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}

                <Button
                  className="w-full px-2"
                  variant={'secondary'}
                  size={'sm'}
                  onClick={e => {
                    e.stopPropagation();
                    updateFilter('category', undefined);
                    setSelectKey(+new Date());
                  }}
                >
                  Clear
                </Button>
              </SelectContent>
            </Select>

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
