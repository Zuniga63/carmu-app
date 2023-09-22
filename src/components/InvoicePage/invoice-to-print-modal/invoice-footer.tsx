import { useConfigStore } from '@/store/config-store';

type Props = {
  sellerName?: string;
};

export default function InvoiceFooter({ sellerName }: Props) {
  const premiseStore = useConfigStore(state => state.premiseStore);

  return (
    <>
      <p className="text-center text-sm">
        Vendedor: <span className="font-bold">{sellerName}</span>
      </p>
      <p className="text-center text-xs font-bold">{premiseStore ? premiseStore.name : 'Tienda Carmú'}</p>
    </>
  );
}
