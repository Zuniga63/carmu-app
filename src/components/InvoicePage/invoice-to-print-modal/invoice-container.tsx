import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';

const containerVariants = cva('flex-grow-0 rounded bg-white p-2', {
  variants: {
    size: {
      sm: 'w-[55mm]',
      md: 'w-[80mm]',
      lg: 'w-full',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

type Props = VariantProps<typeof containerVariants> & {
  children?: React.ReactNode;
  isLoading?: boolean;
  hasError?: boolean;
};

const InvoiceContainer = forwardRef<HTMLDivElement, Props>(({ children, size, isLoading, hasError }, ref) => {
  const isOk = !isLoading && !hasError;

  return (
    <div className="flex-grow bg-gray-200 p-4">
      <div className="flex w-full justify-center">
        <div className={cn(containerVariants({ size }))}>
          <div className={`mx-auto text-dark ${size === 'lg' && 'w-11/12 pt-10'}`} ref={ref}>
            {isLoading && <p className="animate-pulse text-neutral-500">Cargando factura...</p>}
            {hasError && <p className="text-center text-red-400">Hubo un error al cargar la factura.</p>}
            {isOk && children}
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceContainer.displayName = 'InvoiceContainer';

export default InvoiceContainer;
