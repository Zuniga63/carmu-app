import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';
import { Select } from '@mantine/core';
import { IconBox } from '@tabler/icons-react';
import { useMemo } from 'react';

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
};

export default function CounterSaleBoxSelect({ value, onChange }: Props) {
  const { data } = useGetAllBoxes();

  const boxes = useMemo(() => {
    if (!data) return [];
    return data.boxes
      .filter(item => Boolean(item.openBox))
      .map(box => ({
        value: box.id,
        label: box.name,
      }));
  }, [data]);

  return (
    <div className="mb-8 rounded-lg border border-gray-400 p-4 shadow-lg dark:shadow dark:shadow-light">
      {/* BOX */}
      <Select
        label="Caja"
        placeholder="Selecciona una caja"
        value={value}
        onChange={onChange}
        icon={<IconBox size={18} />}
        data={boxes || []}
        searchable
        clearable
      />
    </div>
  );
}
