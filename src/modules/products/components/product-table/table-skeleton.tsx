import { TableCell, TableRow } from '@/components/ui/TablePro';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  isLoading: boolean;
};

export function TableSkeleton({ isLoading = false }: Props) {
  if (!isLoading) return null;
  return (
    <>
      {Array(10)
        .fill(null)
        .map((_, index) => (
          <TableRow key={index}>
            <TableCell colSpan={7} className="text-center">
              <Skeleton className="h-8 w-full" />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
