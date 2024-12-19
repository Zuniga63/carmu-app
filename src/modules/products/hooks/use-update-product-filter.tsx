import { useState, useRef } from 'react';
import { useProductPageStore, type ProductPageFilter } from '../stores/product-page.store';

export function useUpdateProductFilter(filter?: ProductPageFilter) {
  const updateFilter = useProductPageStore(state => state.updateFilter);

  const [isLoading, setIsLoading] = useState(false);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const updateValue = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setIsLoading(true);
    debounceInterval.current = setTimeout(() => {
      setIsLoading(false);
      if (filter) updateFilter(filter, value);
    }, 350);
  };

  return { isLoading, updateValue };
}
