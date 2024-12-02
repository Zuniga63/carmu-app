import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PremiseStore } from '../../interfaces';
import StoreInfoCell from './StoreInfoCell';
import { currencyFormat } from '@/lib/utils';
import { IconBoxOff } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { IconLockOpen } from '@tabler/icons-react';

interface PremiseStoreConfigTableProps {
  premiseStores?: PremiseStore[];
}

export function PremiseStoreConfigTable({ premiseStores = [] }: PremiseStoreConfigTableProps) {
  return (
    <Table>
      <TableCaption>Listado de sucursales</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="text-center">Facturas</TableHead>
          <TableHead className="text-center">Venta semanal</TableHead>
          <TableHead className="text-center">Venta mensual</TableHead>
          <TableHead className="text-center">Caja</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {premiseStores.map(premiseStore => (
          <TableRow key={premiseStore.id}>
            <StoreInfoCell premiseStore={premiseStore} />
            <TableCell className="text-center text-xs">{premiseStore.invoices}</TableCell>
            <TableCell className="text-center text-xs">{currencyFormat(premiseStore.weeklySales)}</TableCell>
            <TableCell className="text-center text-xs">{currencyFormat(premiseStore.monthlySales)}</TableCell>
            <TableCell>
              <div className="flex justify-center">
                {premiseStore.defaultBox ? (
                  <div className="flex gap-x-2">
                    {premiseStore.defaultBox.openBox ? (
                      <IconLockOpen size={18} className="text-green-500 shrink-0" />
                    ) : (
                      <IconLock size={18} className="text-red-500 shrink-0" />
                    )}
                    {premiseStore.defaultBox.name}
                  </div>
                ) : (
                  <IconBoxOff />
                )}
              </div>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
