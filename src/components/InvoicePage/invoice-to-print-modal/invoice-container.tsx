import type { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import React, { ReactNode, forwardRef } from 'react';
type Props = {
  children?: ReactNode;
  size: InvoicePrintSize;
};

const InvoiceContainer = forwardRef<HTMLDivElement, Props>(({ children, size }, ref) => {
  return (
    <div className="flex-grow bg-gray-200 p-4">
      <div className="flex w-full justify-center">
        <div
          className={`flex-grow-0 rounded bg-white p-2 ${size === 'sm' && 'w-[55mm]'}  ${size === 'md' && 'w-[80mm]'} ${
            size === 'lg' && 'w-full'
          }`}
        >
          <div className={`mx-auto text-dark ${size === 'lg' && 'w-11/12 pt-10'}`} ref={ref}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceContainer.displayName = 'InvoiceContainer';

export default InvoiceContainer;

// export default function InvoiceContainer({ children, size }: Props) {
//   return (
//     <div className="flex-grow bg-gray-200 p-4">
//       <div className="flex w-full justify-center">
//         <div
//           className={`flex-grow-0 rounded bg-white p-2 ${size === 'sm' && 'w-[55mm]'}  ${size === 'md' && 'w-[80mm]'} ${
//             size === 'lg' && 'w-full'
//           }`}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }
