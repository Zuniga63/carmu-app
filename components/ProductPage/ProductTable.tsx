import React from 'react';
import { Button, ScrollArea } from '@mantine/core';
import { IconWriting } from '@tabler/icons';
import { IProduct } from 'types';
import ProductTableItem from './ProductTableItem';

interface Props {
  products: IProduct[];
  openForm(): void;
  mountProduct(customer: IProduct): void;
  deleteProduct(customer: IProduct): Promise<void>;
}
const ProductTable = ({ products, openForm, mountProduct, deleteProduct }: Props) => {
  return (
    <div className="mx-auto w-11/12 pt-4 text-light">
      <header className="rounded-t-md bg-header px-6 py-2">
        <h2 className="text-center text-xl font-bold tracking-wider">Listado de productos</h2>
      </header>
      <ScrollArea className="relative h-[28rem] overflow-y-auto border border-y-0 border-x-header">
        <table className='class="relative mb-2" min-w-full table-auto'>
          <thead className="sticky top-0 bg-dark">
            <tr className="text-gray-300">
              <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                Nombre
              </th>
              <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                Descripción
              </th>
              <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
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
