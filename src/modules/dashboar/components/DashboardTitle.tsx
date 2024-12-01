'use client';

import { useConfigStore } from '@/store/config-store';
import { useAppStore } from '@/stores/app-store';

export default function DashboardTitle() {
  const user = useAppStore(state => state.user);
  const premiseStore = useConfigStore(state => state.premiseStore);

  return (
    <div className="mb-2 flex flex-col items-center justify-center py-8 text-dark dark:text-light">
      <h1 className="m-0 text-center text-2xl leading-tight">Bienvenido {user?.name}</h1>
      {premiseStore && <p className="text-sm italic">{premiseStore.name}</p>}
    </div>
  );
}
