import { IInvoiceProduct, INewInvoiceItem } from '@/types';

export const getDiscountFromProduct = (product: IInvoiceProduct): number | undefined => {
  const { hasDiscount, priceWithDiscount, price } = product;
  return hasDiscount && priceWithDiscount && priceWithDiscount < price ? price - priceWithDiscount : undefined;
};

type AddNewItemToListProps = {
  /**
   * Arreglo de items a los que se le va a agregar una nueva instancia
   */
  items: INewInvoiceItem[];
  /**
   * La nueva instancia que se va a verificar si es nueva o actualiza una existente
   */
  newItem: INewInvoiceItem;
};

/**
 * Este metodo crea una copia del arreglo de items y agrega o actualiza los datos
 * de los items existentes segun la nueva instancia
 * @param param0
 */
export const addNewItemToList = ({ items, newItem }: AddNewItemToListProps) => {
  // Se verifica si el item a agregar ya se encuentra en la lista
  const equalItem = items.find(item => {
    let isEqual = true;
    if (item.categories.length !== newItem.categories.length) isEqual = false;
    else if (item.product !== newItem.product) isEqual = false;
    else if (item.productColor !== newItem.productColor) isEqual = false;
    else if (item.productSize !== newItem.productSize) isEqual = false;
    else if (item.tags.length !== newItem.tags.length) isEqual = false;
    else if (item.description !== newItem.description) isEqual = false;
    else if (item.unitValue !== newItem.unitValue) isEqual = false;
    else if (item.discount !== newItem.discount) isEqual = false;

    // Verify categories
    if (isEqual && item.categories.length > 0) {
      newItem.categories.forEach(category => {
        const exist = item.categories.some(ctg => ctg === category);
        if (!exist) isEqual = false;
      });
    }

    // Verify tags
    if (isEqual && item.tags.length > 0) {
      newItem.tags.forEach(tag => {
        const exist = item.tags.some(tg => tg === tag);
        if (!exist) isEqual = false;
      });
    }

    return isEqual;
  });

  if (!equalItem) return [...items, newItem];

  const result = [...items];
  const index = result.findIndex(item => item.id === equalItem.id);

  equalItem.quantity += newItem.quantity;
  equalItem.amount += newItem.amount;
  result.splice(index, 1, equalItem);

  return result;
};
