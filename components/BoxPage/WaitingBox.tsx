import React from 'react';
import { IconBox } from '@tabler/icons';
import LoadinTransacctions from './LoadinTransacctions';

interface Props {
  loading: boolean;
}

const WaitingBox = ({ loading }: Props) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <IconBox size={64} />
        {!loading && <p>Selecciona una caja que esté abierta.</p>}
        {loading && <LoadinTransacctions />}
      </div>
    </div>
  );
};

export default WaitingBox;
