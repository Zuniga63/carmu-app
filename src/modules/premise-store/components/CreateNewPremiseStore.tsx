'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePremisesStore } from '../store';
import { useState } from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

export function CreateNewPremiseStore() {
  const showCreatePremiseModal = usePremisesStore(state => state.showCreatePremiseModal);
  const setShowCreatePremiseModal = usePremisesStore(state => state.setShowCreatePremiseModal);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultBox, setDefaultBox] = useState<string | undefined>(undefined);

  return (
    <Dialog open={showCreatePremiseModal} onOpenChange={setShowCreatePremiseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar sucursal</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Nombre</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la sucursal" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Dirección</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Dirección de la sucursal" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Teléfono</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono de la sucursal" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
