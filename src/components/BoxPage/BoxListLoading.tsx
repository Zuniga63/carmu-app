import { IconLoader3 } from '@tabler/icons-react';

const BoxListLoading = () => {
  return (
    <div className="h-96 3xl:h-[70vh]">
      <div className="flex h-full flex-col items-center justify-center gap-y-2">
        <IconLoader3 size={32} className="animate-spin text-primary" />
        <p className="animate-pulse text-sm">Recuperando las cajas...</p>
      </div>
    </div>
  );
};

export default BoxListLoading;
