import { IconBrandWhatsapp, IconMapPin } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React from 'react';
import Image from 'next/image';
import { IInvoiceBaseFull } from 'src/types';
import { currencyFormat } from 'src/utils';
import brandLogo from 'public/images/logo_62601199d793d.png';

interface Props {
  invoice: IInvoiceBaseFull;
  size: InvoiceSize;
}

export type InvoiceSize = 'sm' | 'md' | 'lg';

const InvoiceToPrint = ({ invoice, size = 'lg' }: Props) => {
  return (
    <div className={`mx-auto bg-white text-dark ${size === 'lg' && 'w-11/12 pt-10'}`}>
      <header
        className={`mb-2 border-b-4 border-double border-dark pb-2 ${
          size === 'lg' && 'lg:flex lg:items-center lg:justify-between'
        }`}
      >
        {/* Brand Logo */}
        <figure className={`mx-auto ${size === 'lg' ? 'mx-0 mb-0 w-40' : 'mb-2'} flex w-10/12 items-center`}>
          <Image src={brandLogo} alt="Carmú Logo" />
        </figure>

        {/* Bussiness Information */}
        <div className={`${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <h1 className={`text-center ${size === 'sm' ? 'text-xl' : 'text-2xl'} font-bold italic tracking-wider`}>
            Tienda Carmú
          </h1>

          <p className="text-center">
            Nit: <span className="font-bold tracking-widest">1098617663-1</span>
          </p>
          <div className="flex items-center justify-center gap-x-2 text-gray-800">
            {size === 'md' ? <IconMapPin size={16} /> : null}
            <p className="text-center font-bold tracking-widest">C.C Ibirico plaza Local 15 al 17</p>
          </div>
          <div className="flex items-center justify-center gap-x-2">
            <IconBrandWhatsapp size={16} className="inline-block" />
            <p className="font-bold tracking-widest">320 555 5387</p>
          </div>
        </div>

        {/* Invoice Number */}
        {size === 'lg' ? (
          <div className="hidden lg:block">
            <h2 className="text-center text-base uppercase xxs:text-xl">
              {invoice.isSeparate ? 'Apartado' : 'Factura'}
            </h2>

            <p className="text-center text-base xxs:text-xl">
              N° <span className="font-bold text-dark xxs:text-red-500">{invoice.prefixNumber}</span>
            </p>
          </div>
        ) : null}
      </header>
      {/* INVOICE INFO */}
      <div className="mb-2 border-b-4 border-double border-dark pb-2">
        {/* INVOICE NUMBER */}
        {size !== 'lg' ? (
          <div className={`mb-2 text-center ${size === 'sm' ? 'text-base' : 'flex justify-center gap-2 text-xl'}`}>
            <h2 className="uppercase">{invoice.isSeparate ? 'Apartado' : 'Factura de venta'}</h2>
            <p>
              N°{' '}
              <span className={size === 'sm' ? 'font-bold text-dark' : 'font-bold text-red-500'}>
                {invoice.prefixNumber}
              </span>
            </p>
          </div>
        ) : null}

        {/* Expedition */}
        <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
          <p>Fecha:</p>
          <p className="font-bold">{dayjs(invoice.expeditionDate).format('YYYY-MM-DD')}</p>
        </div>
        <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
          <p>Hora:</p>
          <p className="font-bold">{dayjs(invoice.expeditionDate).format('hh:mm a')}</p>
        </div>
        {/* Customer */}
        <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
          <p>Cliente:</p>
          <p className="line-clamp-1 font-bold">
            {invoice.customer ? invoice.customer.fullName : invoice.customerName}
          </p>
        </div>
        {/* DOCUMENT */}
        {invoice.customerDocument && (
          <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
            <p>{invoice.customerDocumentType}:</p>
            <p className="line-clamp-1 font-bold">{invoice.customerDocument}</p>
          </div>
        )}
        {/* ADDRESS */}
        {invoice.customerAddress && (
          <div className={size === 'sm' ? 'flex justify-between text-xs' : 'flex justify-between text-sm'}>
            <p>Dirección:</p>
            <p className="line-clamp-1 font-bold">{invoice.customerAddress}</p>
          </div>
        )}
      </div>
      {/* INVOICE ITEMS */}
      <div className="mb-2 border-b-4 border-double border-dark pb-2">
        <div className="mb-2 border-b border-dashed pb-2">
          <div className="mb-2 flex justify-between font-bold">
            <h3 className={size === 'sm' ? 'text-xs uppercase ' : 'text-sm uppercase'}>Cant.</h3>
            <h3
              className={
                size === 'sm' ? 'justify-self-start text-xs uppercase' : 'justify-self-start text-sm uppercase'
              }
            >
              Descripción
            </h3>
            <h3 className={size === 'sm' ? 'text-xs uppercase ' : 'text-sm uppercase'}>Vlr. Unt</h3>
          </div>
          {invoice.items.map(item => (
            <div
              key={item.id}
              className={
                size === 'sm'
                  ? 'mb-1 flex items-center justify-between gap-x-2 text-xs'
                  : 'mb-1 flex items-center justify-between gap-x-2 text-sm'
              }
            >
              <p className="flex-shrink-0 px-2">{item.quantity}</p>
              <p className="flex-grow uppercase">{item.description}</p>
              <div className="flex flex-shrink-0 flex-col items-end justify-center">
                {item.discount && (
                  <p className="text-xs text-gray-700 line-through">{currencyFormat(item.unitValue)}</p>
                )}
                <p className="flex-shrink-0 tracking-widest">{currencyFormat(item.unitValue - (item.discount || 0))}</p>
              </div>
            </div>
          ))}
        </div>
        {/* RESUME */}
        <div className="flex justify-end gap-x-4">
          <div className="flex flex-col items-end">
            <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Subtotal:</p>
            {invoice.discount && <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Descuento:</p>}
            <p className={size === 'sm' ? 'text-base font-bold' : 'text-lg font-bold'}>Total:</p>
          </div>
          <div className="flex flex-col items-end">
            <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(invoice.subtotal)}</p>
            {invoice.discount && (
              <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(invoice.discount)}</p>
            )}
            <p className={size === 'sm' ? 'text-base font-bold' : 'text-lg font-bold'}>
              {currencyFormat(invoice.amount)}
            </p>
          </div>
        </div>
      </div>
      {/* PAYMENTS */}
      <div className="mb-4">
        <h3 className={size === 'sm' ? 'mb-2 text-center text-sm font-bold' : 'mb-2 text-center text-base font-bold'}>
          Forma de pago
        </h3>
        {Boolean(invoice.cashChange) ? (
          <div className="flex justify-end gap-x-4">
            <div className="flex flex-col items-end">
              <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Efectivo:</p>
              <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Cambio:</p>
            </div>
            <div className="flex flex-col items-end">
              <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(invoice.cash)}</p>
              <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(invoice.cashChange)}</p>
            </div>
          </div>
        ) : (
          <div>
            {invoice.payments.map(payment => (
              <div
                key={payment.id}
                className={
                  size === 'sm'
                    ? 'flex items-center justify-evenly gap-x-2 text-xs'
                    : 'flex items-center justify-evenly gap-x-2 text-sm'
                }
              >
                <p className="flex-shrink-0">{dayjs(payment.paymentDate).format('DD-MM-YY')}</p>
                <p className="flex-grow">{payment.description}</p>
                <p className="flex-shrink-0">{currencyFormat(payment.amount)}</p>
              </div>
            ))}
          </div>
        )}

        {Boolean(invoice.balance) ? (
          <div className={`${size === 'sm' ? 'p-2' : 'p-4'} mx-auto mt-4 w-9/12 rounded-lg border-4 border-gray-dark`}>
            <h3 className="mb-2 border-b-8 border-double border-gray-dark text-center text-lg tracking-wider text-dark">
              Saldo
            </h3>
            <p className="text-center text-xl font-bold tracking-widest text-gray-dark">
              {currencyFormat(invoice.balance)}
            </p>
          </div>
        ) : null}
      </div>

      <p className="text-center text-sm">
        Vendedor: <span className="font-bold">{invoice.sellerName}</span>
      </p>
      <p className="text-center text-xs font-bold">Tienda Carmú</p>
    </div>
  );
};

export default InvoiceToPrint;
