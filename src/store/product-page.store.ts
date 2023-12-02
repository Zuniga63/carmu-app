import { create } from 'zustand';

export type ProductPageFilter = 'search' | 'category' | 'productSize' | 'productRef';

type ProductPageState = {
  search: string | undefined;
  category: string | undefined;
  productSize: string | undefined;
  productRef: string | undefined;
  formIsOpen: boolean;
  productToEditId?: string;
  productToDeleteId?: string;
};

type ProductPageActions = {
  updateFilter: (filter: ProductPageFilter, value?: string) => void;
  clearFilters: () => void;
  showForm: (productToEditId?: string) => void;
  hideForm: () => void;
  showDeleteDialog: (productToDeleteId: string) => void;
  hideDeleteDialog: () => void;
};

export const useProductPageStore = create<ProductPageState & ProductPageActions>((set, get) => ({
  search: undefined,
  category: undefined,
  productSize: undefined,
  productRef: undefined,
  formIsOpen: false,
  productToEditId: undefined,
  updateFilter(filter, value) {
    if (filter === 'search') set({ search: value });
    else if (filter === 'category') set({ category: value });
    else if (filter === 'productSize') set({ productSize: value });
    else if (filter === 'productRef') set({ productRef: value });
  },
  clearFilters() {
    set({ search: undefined, category: undefined, productSize: undefined, productRef: undefined });
  },
  showForm(productToEditId) {
    set({ formIsOpen: true, productToEditId });
  },
  hideForm() {
    set({ formIsOpen: false, productToEditId: undefined });
  },
  showDeleteDialog(productToDeleteId) {
    set({ productToDeleteId });
  },
  hideDeleteDialog() {
    set({ productToDeleteId: undefined });
  },
}));
