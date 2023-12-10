import type { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import { useConfigStore } from '@/store/config-store';
import { IconBrandWhatsapp, IconMapPin } from '@tabler/icons-react';
import Image from 'next/image';
import brandLogo from '@/../public/images/logo_62601199d793d.png';

type Props = {
  size: InvoicePrintSize;
  isSeparate?: boolean;
  invoiceNumber?: string;
};

export default function InvoiceHeader({ size, isSeparate, invoiceNumber }: Props) {
  const premiseStore = useConfigStore(state => state.premiseStore);
  const title = premiseStore?.name || process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <header
      className={`mb-2 border-b-4 border-double border-dark pb-2 ${
        size === 'lg' && 'flex items-center justify-between'
      }`}
    >
      {/* Brand Logo */}
      <figure
        className={`${
          size === 'lg' ? 'mx-0 mb-0 w-40 ' : 'mx-auto mb-2 w-10/12'
        } relative flex aspect-video items-center outline-red-50`}
      >
        <Image
          src={process.env.NEXT_PUBLIC_BRAND_LOGO_URL || brandLogo}
          alt={process.env.NEXT_PUBLIC_APP_NAME || 'App Name'}
          className="object-contain"
          fill
        />
      </figure>

      {/* Bussiness Information */}
      <div className={`${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <h1 className={`text-center ${size === 'sm' ? 'text-xl' : 'text-2xl'} font-bold italic tracking-wider`}>
          {title}
        </h1>

        <p className="text-center">
          Nit: <span className="font-bold tracking-widest">1098617663-1</span>
        </p>
        <div className="flex items-center justify-center gap-x-2 text-gray-800">
          {size === 'md' ? <IconMapPin size={16} /> : null}
          <p className="text-center font-bold tracking-widest">
            {premiseStore?.address || 'C.C Ibirico plaza Local 15 al 17'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-x-2">
          <IconBrandWhatsapp size={16} className="inline-block" />
          <p className="font-bold tracking-widest">{premiseStore?.phone ? premiseStore.phone : '320 555 5387'}</p>
        </div>
      </div>

      {/* Invoice Number */}
      <div className={` ${size === 'lg' ? 'block' : 'hidden'}`}>
        <h2 className="text-center text-base uppercase xxs:text-xl">{isSeparate ? 'Apartado' : 'Factura'}</h2>

        <p className="text-center text-base xxs:text-xl">
          N° <span className="font-bold text-dark xxs:text-red-500">{invoiceNumber}</span>
        </p>
      </div>
    </header>
  );
}
