import { Loader } from '@mantine/core';

export default function InvoiceListLoader() {
  return (
    <div className="flex h-full flex-col justify-center gap-y-4">
      <div className="flex flex-col items-center gap-y-4 rounded bg-white bg-opacity-20 p-4 backdrop-blur dark:bg-dark dark:bg-opacity-40">
        <Loader />
        <p className="animate-pulse text-center text-xs tracking-widest text-dark dark:text-light">
          Se están recuperando las facturas, esto puede tardar un poco...
        </p>
      </div>
    </div>
  );
}
