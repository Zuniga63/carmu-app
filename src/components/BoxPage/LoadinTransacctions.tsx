import { IconLoader2 } from '@tabler/icons-react';

const LoadinTransacctions = () => {
  return (
    <div className="flex items-center gap-x-2">
      <IconLoader2 size={24} className="animate-spin" />
      <p className="animate-pulse">Recuperando transacciones...</p>
    </div>
  );
};

export default LoadinTransacctions;
