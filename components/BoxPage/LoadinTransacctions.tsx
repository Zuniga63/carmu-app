import React from 'react';
import { Loader } from '@mantine/core';

const LoadinTransacctions = () => {
  return (
    <div className="flex items-center gap-x-2">
      <Loader size="xs" />
      <p className="animate-pulse">Recuperando transacciones...</p>
    </div>
  );
};

export default LoadinTransacctions;
