import React, { useEffect, useRef, useState } from 'react';
import { Button, Loader, ScrollArea, TextInput } from '@mantine/core';
import { IconSearch, IconWriting } from '@tabler/icons';
import { IProductWithCategories } from 'types';
import ProductTableItem from './ProductTableItem';
import { normalizeText } from 'utils';

interface Props {
  allProducts: IProductWithCategories[];
  openForm(): void;
  mountProduct(product: IProductWithCategories): void;
  deleteProduct(product: IProductWithCategories): Promise<void>;
}

const ProductTable = ({ allProducts, openForm, mountProduct, deleteProduct }: Props) => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProductWithCategories[]>([]);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const updateSearch = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setLoading(true);
    debounceInterval.current = setTimeout(() => {
      setLoading(false);
      setSearch(value);
    }, 500);
  };

  const updateProductList = () => {
    let result = allProducts.slice();
    if (search) {
      result = result.filter(item => {
        const text = normalizeText(
          [item.name, item.description || '', item.ref || '', item.barcode || ''].join(' ').trim()
        );
        return text.includes(normalizeText(search));
      });
    }

    setProducts(result);
  };

  useEffect(() => {
    console.log('actualizar');
    updateProductList();
  }, [allProducts, search]);

  return (
    <div className="mx-auto w-11/12 pt-4 text-light">
      <header className="rounded-t-md bg-header px-6 py-2">
        <h2 className="text-center text-xl font-bold tracking-wider">Listado de productos</h2>
        <div className="grid grid-cols-3">
          <TextInput
            size="xs"
            icon={loading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
            placeholder="Buscar producto"
            className="flex-grow"
            onChange={({ target }) => updateSearch(target.value)}
          />
        </div>
      </header>
      <ScrollArea className="relative h-[26rem] overflow-y-auto border border-y-0 border-x-header 3xl:h-[70vh]">
        <table className='class="relative mb-2" min-w-full table-auto'>
          <thead className="sticky top-0 bg-dark">
            <tr className="text-gray-300">
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
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <ProductTableItem product={product} key={product.id} mount={mountProduct} onDelete={deleteProduct} />
            ))}
          </tbody>
        </table>
      </ScrollArea>
      <footer className="flex justify-end rounded-b-md bg-header px-6 py-2">
        <Button leftIcon={<IconWriting />} onClick={() => openForm()}>
          Agregar Producto
        </Button>
      </footer>
    </div>
  );
};

export default ProductTable;
