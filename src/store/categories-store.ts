import { create } from 'zustand';

interface ICategoryPagestate {
  formOpened: boolean;
  categoryToUpdate?: string;
  categoryToDelete?: string;
}

interface ICategoryPageActions {
  showForm: (categoryId?: string) => void;
  hideForm: () => void;
  deleteCategory: (categoryId: string) => void;
  cancelDeleteCategory: () => void;
}

export const useCategoryPageStore = create<ICategoryPagestate & ICategoryPageActions>()((set, get) => ({
  formOpened: false,
  categoryToUpdate: undefined,
  showForm(categoryId) {
    set({ formOpened: true, categoryToUpdate: categoryId });
  },
  hideForm() {
    set({ formOpened: false, categoryToUpdate: undefined });
  },
  deleteCategory(categoryId) {
    set({ categoryToDelete: categoryId });
  },
  cancelDeleteCategory() {
    set({ categoryToDelete: undefined });
  },
}));
