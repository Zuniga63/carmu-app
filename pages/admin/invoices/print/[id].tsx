import { IconBrandWhatsapp, IconMapPin } from '@tabler/icons';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import brandLogo from 'public/images/logo_62601199d793d.png';
import { IInvoiceBaseFull } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  invoice: IInvoiceBaseFull;
}

const PrintPage: NextPage<Props> = ({ invoice }) => {
  return (
    <div className="mx-auto min-h-screen max-w-sm bg-white text-dark">
      <header className="mb-2 border-b-4 border-double border-dark pb-2">
        <figure className="mx-auto mb-2 flex w-10/12 items-center">
          <Image src={brandLogo} alt="Carmú Logo" />
        </figure>
        <h1 className="text-center text-2xl font-bold italic tracking-wider">
          Tienda Carmú
        </h1>
        <p className="text-center text-sm">
          Nit: <span className="font-bold tracking-widest">1098617663-1</span>
        </p>
        <div className="flex items-center justify-center gap-x-2 text-gray-800">
          <IconMapPin size={16} className="inline-block" />
          <p className="text-sm font-bold tracking-widest">
            C.C Ibirico plaza Local 15 al 17
          </p>
        </div>
        <div className="flex items-center justify-center gap-x-2">
          <IconBrandWhatsapp size={16} className="inline-block" />
          <p className="text-sm font-bold tracking-widest">320 555 5387</p>
        </div>
      </header>
      {/* INVOICE INFO */}
      <div className="mb-2 border-b-4 border-double border-dark pb-2">
        <h2 className="mb-2 text-center text-xl uppercase">
          {invoice.isSeparate ? 'Apartado' : 'Factura de venta'} N°{' '}
          <span className="font-bold text-red-500">{invoice.prefixNumber}</span>
        </h2>
        {/* Expedition */}
        <div className="flex justify-between text-sm">
          <p>Fecha:</p>
          <p>{dayjs(invoice.expeditionDate).format('DD-MM-YYYY hh:mm a')}</p>
        </div>
        {/* Customer */}
        <div className="flex justify-between text-sm">
          <p>Cliente:</p>
          <p className="line-clamp-1">
            {invoice.customer
              ? invoice.customer.fullName
              : invoice.customerName}
          </p>
        </div>
        {/* DOCUMENT */}
        {invoice.customerDocument && (
          <div className="flex justify-between text-sm">
            <p>{invoice.customerDocumentType}:</p>
            <p className="line-clamp-1">{invoice.customerDocument}</p>
          </div>
        )}
        {/* ADDRESS */}
        {invoice.customerAddress && (
          <div className="flex justify-between text-sm">
            <p>Dirección:</p>
            <p className="line-clamp-1">{invoice.customerAddress}</p>
          </div>
        )}
      </div>
      {/* INVOICE ITEMS */}
      <div className="mb-2 border-b-4 border-double border-dark pb-2">
        <div className="mb-2 border-b border-dashed pb-2">
          <div className="mb-2 flex justify-between font-bold">
            <h3 className="text-sm uppercase">Cant.</h3>
            <h3 className="justify-self-start text-sm uppercase">
              Descripción
            </h3>
            <h3 className="text-sm uppercase">Vlr. Unt</h3>
          </div>
          {invoice.items.map(item => (
            <div
              key={item.id}
              className="mb-1 flex items-center justify-between gap-x-2 text-sm"
            >
              <p className="flex-shrink-0 px-2">{item.quantity}</p>
              <p className="flex-grow uppercase">{item.description}</p>
              <div className="flex flex-col items-end justify-center">
                {item.discount && (
                  <p className="text-xs text-gray-700 line-through">
                    {currencyFormat(item.unitValue)}
                  </p>
                )}
                <p className="flex-shrink-0 tracking-widest">
                  {currencyFormat(item.unitValue - (item.discount || 0))}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* RESUME */}
        <div className="flex justify-end gap-x-4">
          <div className="flex flex-col items-end">
            <p className="text-sm">Subtotal:</p>
            {invoice.discount && <p className="text-sm">Descuento:</p>}
            <p className="text-lg font-bold">Total:</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm">{currencyFormat(invoice.subtotal)}</p>
            {invoice.discount && (
              <p className="text-sm">{currencyFormat(invoice.discount)}</p>
            )}
            <p className="text-lg font-bold">
              {currencyFormat(invoice.amount)}
            </p>
          </div>
        </div>
      </div>
      {/* PAYMENTS */}
      <div className="mb-4">
        <h3 className="mb-2 text-center">Forma de pago</h3>
        {Boolean(invoice.cashChange) ? (
          <div className="flex justify-end gap-x-4">
            <div className="flex flex-col items-end">
              <p className="text-sm">Efectivo:</p>
              <p className="text-sm">Cambio:</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm">{currencyFormat(invoice.cash)}</p>
              <p className="text-sm">{currencyFormat(invoice.cashChange)}</p>
            </div>
          </div>
        ) : (
          <div>
            {invoice.payments.map(payment => (
              <div
                key={payment.id}
                className="flex items-center justify-evenly gap-x-2 text-sm"
              >
                <p className="flex-shrink-0">
                  {dayjs(payment.paymentDate).format('DD-MM-YY')}
                </p>
                <p className="flex-grow">{payment.description}</p>
                <p className="flex-shrink-0">
                  {currencyFormat(payment.amount)}
                </p>
              </div>
            ))}
          </div>
        )}

        {Boolean(invoice.balance) ? (
          <div className="mx-auto mt-4 w-9/12 rounded-lg border-4 py-4 px-4">
            <h3 className="mb-2 border-b-4 border-double border-gray-300 text-center text-lg tracking-wider text-dark">
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

export default PrintPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const { token } = context.req.cookies;
  const { id } = context.query;
  let invoice = null;

  if (token) {
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const url = `${baseUrl}/invoices/${id}`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(url, { headers });
      const resData = await res.json();
      invoice = resData.invoice;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    props: { invoice },
  };
};
