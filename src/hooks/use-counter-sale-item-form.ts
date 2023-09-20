import { useEffect, useRef, useState } from 'react';
import { useGetAllLiteProducts } from '@/hooks/react-query/product.hooks';
import { useAppSelector } from '@/store/hooks';
import { categoryPageSelector } from '@/features/CategoryPage';
import type { INewInvoiceItem } from '@/types';
import { getDiscountFromProduct } from '@/logic/invoices-form';

export function useCounterSaleItemForm() {
  const { data: products } = useGetAllLiteProducts();
  const { categories } = useAppSelector(categoryPageSelector);
  const quantityRef = useRef<HTMLInputElement>(null);

  const [productId, setProductId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState<number | undefined>(1);
  const [itemUnitValue, setItemUnitValue] = useState<number | undefined>(undefined);
  const [itemDiscount, setItemDiscount] = useState<number | undefined>(undefined);
  const [itemAmount, setItemAmount] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);

  const resetState = () => {
    setProductId(null);
    setCategoryId(null);
    setItemDescription('');
    setItemQuantity(1);
    setItemUnitValue(undefined);
    setItemDiscount(undefined);
    quantityRef.current?.focus();
  };

  const getItemData = (): INewInvoiceItem => ({
    id: String(new Date().getTime()),
    product: productId || undefined,
    categories: categoryId ? [categoryId] : [],
    tags: [],
    description: itemDescription,
    quantity: itemQuantity || 0,
    unitValue: itemUnitValue || 0,
    discount: itemDiscount,
    amount: itemAmount || 0,
  });

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  /**
   * Este efecto se encarga de actualizar los datos del formulario
   * con los datos del producto seleccinado
   */
  useEffect(() => {
    const product = products?.find(p => p.id === productId);
    if (!product) return;

    setItemDescription(product.name);
    setItemUnitValue(product.price);
    setItemDiscount(getDiscountFromProduct(product));

    if (product.categories.length > 0) setCategoryId(product.categories[0]);
  }, [productId]);

  /**
   * Este efecto actualiza el valor total de item
   */
  useEffect(() => {
    let amount: number | undefined;

    if (itemQuantity && itemUnitValue) {
      amount = itemQuantity * itemUnitValue;
      if (itemDiscount && itemDiscount < itemUnitValue) amount -= itemQuantity * itemDiscount;
    }

    setItemAmount(amount);
  }, [itemQuantity, itemUnitValue, itemDiscount]);

  /**
   * Este efecto se encarga de definir si se habilita agregar el item al arreglo
   */
  useEffect(() => {
    const isEnabled = Boolean(typeof itemAmount !== 'undefined' && itemDescription && itemAmount > 0);
    setEnabled(isEnabled);
  }, [itemAmount, itemDescription]);

  return {
    products: products || [],
    categories,
    quantityRef,
    newItem: {
      productId: { value: productId, update: setProductId },
      categoryId: { value: categoryId, update: setCategoryId },
      description: { value: itemDescription, update: setItemDescription },
      quantity: { value: itemQuantity, update: setItemQuantity },
      unitValue: { value: itemUnitValue, update: setItemUnitValue },
      discount: { value: itemDiscount, update: setItemDiscount },
      amount: { value: itemAmount, update: setItemAmount },
    },
    isEnabled: enabled,
    getItemData,
    resetState,
  };
}
