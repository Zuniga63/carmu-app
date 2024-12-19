'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import { useProductPageStore } from '../stores/product-page.store';
import { useGetAllLiteProducts } from '@/hooks/react-query/product.hooks';
import { useEffect, useRef, useState } from 'react';
import { IInvoiceProduct } from '@/types';
import { IconQrcode } from '@tabler/icons-react';

import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';

export function ProductQRGenerator() {
  const productToQrId = useProductPageStore(state => state.productToQrId);
  const hideQrDialog = useProductPageStore(state => state.mountQrDialog);
  const [product, setProduct] = useState<IInvoiceProduct | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);

  const { data: products = [] } = useGetAllLiteProducts();

  const handleDownload = async () => {
    if (!qrRef.current || !productToQrId || !product) return;

    try {
      const dataUrl = await toPng(qrRef.current);
      const link = document.createElement('a');
      link.download = `${product.name}-${product.ref}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error al generar el QR:', error);
    }
  };

  useEffect(() => {
    if (!productToQrId) return;
    const product = products.find(p => p.ref === productToQrId);
    if (!product) return;
    setProduct(product);
  }, [productToQrId, products]);

  const handleClose = () => {
    hideQrDialog();
  };

  return (
    <AlertDialog open={Boolean(productToQrId)} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Codigo QR</AlertDialogTitle>
          <AlertDialogDescription>
            Se generara un codigo QR para el producto <strong>{productToQrId}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center">
          <div className="w-96 rounded-md bg-white p-3" ref={qrRef}>
            <div className="flex flex-col items-center space-y-4">
              <figure className="aspect-square w-56 overflow-hidden rounded-md bg-white">
                <QRCodeCanvas value={product?.ref || ''} size={224} />
              </figure>
              <div className="flex flex-col items-center justify-center">
                <h3 className="line-clamp-1 font-bold text-dark">{product?.name}</h3>
                <p className="text-sm text-neutral-700">{product?.ref}</p>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDownload}>Descargar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
